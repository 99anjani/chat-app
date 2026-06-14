export const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const { seconds, nanoseconds } = timestamp;
    const date = new Date(seconds * 1000 + nanoseconds / 1000000);

    const now = new Date();

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }

    if (isYesterday) {
        return "Yesterday";
    }

    // e.g. 5/31/26
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const y = String(date.getFullYear()).slice(-2);
    return `${m}/${d}/${y}`;
};