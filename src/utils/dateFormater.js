export const isSameDay = (d1,d2) =>{
    return(
        d1.getFullYear() === d2.getFullYear() 
        && d1.getMonth() === d2.getMonth() 
        && d1.getDate() === d2.getDate()
    );
}

export const isToday = (date) => {
    const today= new Date();
    return isSameDay(date,today);
}

export const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate()-1);
    return isSameDay(date,yesterday);
}

export const getDayLable = (timestamp) =>{
    if(!timestamp?.seconds) return "";

    const date = new Date(timestamp.seconds * 1000);

    if(isToday(date)) return "Today";

    if(isYesterday(date)) return "Yesterday";

    return date.toLocaleDateString("en-US",{
        day: "numeric",
        month: "short",
        year: "numeric"
    })
}

export const getTimeOnly = (timestamp) => {
    if (!timestamp?.seconds) return "";

    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
};