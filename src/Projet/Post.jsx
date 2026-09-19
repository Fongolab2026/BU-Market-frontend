import React from 'react'
import { Link } from 'react-router-dom'
export default function Post( {data=[], liker , deleteLike} ) {
  return (
    <div  className={data.liker ? "w-[50%] text-black h-[15%] flex justify-center items-center pl-2 bg-amber-100" : "w-[50%] text-black h-[15%] flex justify-center items-center pl-2 bg-blue-50"}>
      <div className="w-[70%] ">
        <h5 className='text-2xl font-bold'>{data.titre} </h5>
        <p> {data.description} </p>
      </div>
      <div className='w-25% flex justify-center items-center gap-4'>
        <button onClick={() => liker(data)} className='btn btn-success'> {data.liker ? "Deja liker" : "liker"}</button>
        <button onClick={() => deleteLike(data.id)} className='btn btn-error'>Suppimer</button>
      </div>
    </div>
  )
}
