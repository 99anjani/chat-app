import { addDoc, collection } from "firebase/firestore";
import React, {  createContext, useContext, useEffect, useState } from "react";
import { addNotification, auth, listenForNotifications, markAsRead } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import MessageToast from '../components/MessageToast'
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        let unsubscribeNotif;
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                unsubscribeNotif = listenForNotifications(user.uid, (notifs) => {
                    setNotifications(notifs);
                    const latest = notifs[0];

                    if (latest && !latest.read && latest.type === "message") {
                        toast(
                            <MessageToast
                                image={latest.senderImage}
                                name={latest.senderName}
                                message={latest.message}
                                timestamp={latest.timestamp}
                            />,
                            {
                                position: "top-right",
                                autoClose: 4000,
                                closeOnClick: true,
                                pauseOnHover: true,
                            }
                        );
                    }
                });
            } else {
                setNotifications([]); 
            }
        });

        return () => {
            if (unsubscribeNotif) unsubscribeNotif();
            unsubscribeAuth();
        };
    }, [])

    const pushNotification = async (recipientId, message, type = "info") => {
        await addNotification(recipientId, message, type);
    };

    const markNotificationAsRead = async (notificationId) => {
        await markAsRead(notificationId);
    };



    return (
        <NotificationContext.Provider value={{ notifications, addNotification: pushNotification , markNotificationAsRead }}>
            {children}
        </NotificationContext.Provider>
    );

}