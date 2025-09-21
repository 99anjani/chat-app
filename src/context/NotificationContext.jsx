import { addDoc, collection } from "firebase/firestore";
import React, {  createContext, useContext, useEffect, useState } from "react";
import { addNotification, auth, listenForNotifications, markAsRead } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
        <NotificationContext.Provider value={{ notifications, pushNotification , markNotificationAsRead }}>
            {children}
        </NotificationContext.Provider>
    );

}