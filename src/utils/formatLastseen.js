export const formatLastSeen = (timestamp) => {
    if (!timestamp) return "offline";

    const now = Date.now();
    const diff = now - timestamp;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "just now";

    if (minutes < 60) return `${minutes} minute(s) ago`;

    if (hours < 24) {
        const date = new Date(timestamp);
        return `today at ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    }

    return `${days} day(s) ago`;
};