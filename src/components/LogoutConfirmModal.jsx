import React from 'react'

const LogoutConfirmModal = ({isOpen, onCancel, onConfirm}) => {
    if (!isOpen) return null
  return (
      <div className='fixed inset-0 z-[150] flex justify-center items-center bg-[#00170cb7]' >
          <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <h2 className="text-lg font-semibold mb-4">
                  Are you sure you want to logout?
              </h2>
              <div className="flex justify-center gap-4">
                  <button
                      onClick={onConfirm}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                      Logout
                  </button>
                  <button
                      onClick={onCancel}
                      className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                  >
                      Cancel
                  </button>
              </div>
          </div>
      </div>
  )
}

export default LogoutConfirmModal
