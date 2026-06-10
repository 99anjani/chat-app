import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import {
    RiMailLine,
    RiUserLine,
    RiCalendarLine,
    RiMessageLine,
    RiShieldUserLine,
} from "react-icons/ri";
import { formatTimestamp } from "../utils/formatTimeStamp";
import { auth } from "../firebase/firebase";

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/40">
            {icon}
        </div>

        <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-white/30">
                {label}
            </p>
            <p className="text-sm text-white/80 truncate">{value || "—"}</p>
        </div>
    </div>
);

const ProfileModal = ({ isOpen, onClose, user, onStartChat }) => {
    const currentUser = auth.currentUser;
    const isOwnProfile = currentUser?.uid === user?.uid;

    useEffect(() => {
        const handleKey = (e) => e.key === "Escape" && onClose();

        if (isOpen) window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!isOpen || !user) return null;

    const initials = user.fullName
        ? user.fullName
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "?";

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && onClose()}
            role="dialog"
            aria-modal="true"
            aria-label={`${user.fullName}'s profile`}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        >
            {/* Panel */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#13113a] shadow-2xl animate-in fade-in zoom-in-95">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md bg-black/30 text-white/60 hover:text-white hover:bg-black/50 transition"
                >
                    <FaXmark size={14} />
                </button>

                {/* Cover */}
                <div className="relative h-24 bg-[#1a1747] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 via-indigo-600/30 to-indigo-950/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(167,139,250,0.2),transparent_50%),radial-gradient(circle_at_75%_30%,rgba(99,102,241,0.15),transparent_40%)]" />
                </div>

                {/* Avatar Section */}
                <div className="flex items-end justify-between px-5 -mt-10 relative z-10">
                    <div className="w-20 h-20 rounded-full border-4 border-[#13113a] bg-[#1e1b4b] overflow-hidden flex items-center justify-center">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.style.display = "none")}
                            />
                        ) : (
                            <span className="text-lg font-bold text-indigo-300">
                                {initials}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/20">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Online
                    </div>
                </div>

                {/* Identity */}
                <div className="px-5 pt-3">
                    <h2 className="text-lg font-bold text-white">{user.fullName}</h2>
                    <p className="text-sm text-white/40">@{user.username}</p>
                    {user.bio && (
                        <p className="text-sm text-white/60 mt-2 leading-relaxed">
                            {user.bio}
                        </p>
                    )}
                </div>

                <div className="my-4 mx-5 h-px bg-white/10" />

                {/* Info */}
                <div className="px-5">
                    <InfoRow icon={<RiMailLine size={16} />} label="Email" value={user.email} />
                    <InfoRow icon={<RiUserLine size={16} />} label="Username" value={`@${user.username}`} />

                    {user.createdAt && (
                        <InfoRow
                            icon={<RiCalendarLine size={16} />}
                            label="Joined"
                            value={formatTimestamp(user.createdAt)}
                        />
                    )}

                    {user.role && (
                        <InfoRow
                            icon={<RiShieldUserLine size={16} />}
                            label="Role"
                            value={user.role}
                        />
                    )}
                </div>

                {/* Actions */}
                <div className="p-5 flex gap-3">
                    {!isOwnProfile ? (
                        <button
                            onClick={() => {
                                onStartChat?.(user);
                                onClose();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-lg hover:opacity-90 transition"
                        >
                            <RiMessageLine size={16} />
                            Send message
                        </button>
                    ) : (
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 bg-white/10 border border-white/10 hover:bg-white/15 transition"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;