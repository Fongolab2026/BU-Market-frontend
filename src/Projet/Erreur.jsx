import React from 'react'
import { useRouteError } from 'react-router-dom'

export default function Erreur() {
    const erreur = useRouteError()
  return (
    <div className='w-full h-screen flex justify-center items-center flex-col gap-4'>
        <div className='w-[30%] h-[40%] flex justify-center items-center flex-col gap-4 shadow-2xl'>
        <h1>une erreur est survenue</h1>
        <p>
            <i>{erreur.statusText || erreur.message }</i>
        </p>
        </div>
    </div>
  )
}
