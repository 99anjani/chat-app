import { addDoc, collection } from "firebase/firestore";
import React, {  createContext, useContext, useEffect, useState } from "react";
import { addNotification, auth, listenForNotifications, markAsRead } from "../firebase/firebase";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);

    useEffect(()=>{
        let unsubscribe;

        if (auth.currentUser){
            unsubscribe = listenForNotifications(auth.currentUser.uid, (notifs) => {
                setNotifications(notifs);
            })
        }
        return () => {
            if (unsubscribe) unsubscribe();
        };
    },[])

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