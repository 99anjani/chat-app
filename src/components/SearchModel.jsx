import React from 'react'
import {RiSearchLine } from 'react-icons/ri'


const SearchModel = () => {
  return (
    <div>
      <button className='bg-[#C3CFF9] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg'>
        <RiSearchLine color="#080659" className='w-[18px] h-[18px]' />
      </button>
    </div>
  )
}

export default SearchModel
