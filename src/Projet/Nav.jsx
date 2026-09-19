import React from 'react'

export default function Nav( {nombreLiker} ) {
  return (
    <div className='w-full h-[10vh] flex justify-center items-center text-2xl font-bold text-white'>
      <h3>Les postes liker sont: {nombreLiker} </h3>
    </div>
  )
}
