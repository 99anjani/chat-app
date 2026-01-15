import React from 'react'
import defaultProfile from '../../public/assets/user_1.png'
import { formatTimestamp } from '../utils/formatTimeStamp'
const MessageToast = ({image, name, message, timestamp}) => {
  return (
    <div className='flex gap-3 items-start'>
      <img
        src={image || defaultProfile}
        className="w-10 h-10 rounded-full object-cover"
        alt="user"
      />
      <div>
        <p className="font-semibold text-sm text-[#080659]">{name}</p>
        <p className="text-sm text-gray-700">{message}</p>
        <p className="text-xs text-gray-400">
            {formatTimestamp(timestamp)}
        </p>

      </div>
    </div>
  )
}

export default MessageToast
