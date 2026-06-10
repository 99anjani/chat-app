import React, { useEffect } from 'react'

import { RiShutDownLine } from "react-icons/ri";

const LogoutConfirmModal = ({isOpen, onCancel, onConfirm}) => {

    useEffect(()=>{
        const handleKey = (e) => {
            if (e.key === "Escape") onCancel();
            if (e.key === "Enter") onConfirm();
        };

        if(isOpen) window.addEventListener("keydown",handleKey);

        return () => window.removeEventListener("keydown", handleKey);

    }, [isOpen, onCancel, onConfirm])

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-[150] flex justify-center items-center bg-black/60 backdrop-blur-md p-4' onClick={(e)=> e.target === e.currentTarget && onCancel()} role="dialog" araia-modal="true" aria-label="Confirm logout">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#13113a] p-7 text-center shadow-2xl animate-modal">
            
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
                    <RiShutDownLine size={24} />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-white">Sign Out?</h2>

                <p className="mb-7 text-sm leading-relaxed text-white/50">

                    You'll need to sign back in to access your messages and contacts.

                </p>


                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500/60 text-white/60 rounded-xl shadow-md shadow-red-600/30 hover:opacity-90 hover:-translate-y-[1px] active:scale-95 border-red-500/30"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-400/50 text-white/60 rounded-xl shadow-md shadow-gray-600/30 hover:opacity-90 hover:-translate-y-[1px] active:scale-95 border-gray-500/30"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogoutConfirmModal
