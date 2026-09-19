import React from 'react'
import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <div className='w-full h-screen bg-amber-50 flex justify-center items-center '>
      <div className='w-[30%] h-[80%] bg-cyan-950 flex justify-center items-center flex-col gap-8 text-white'>
        <img src="src/media/Capture d'écran 2026-07-29 130643.png" alt="logo" className='w-[50%] h-[40%] rounded-[50%] object-cover'/>
        <h1 className='text-2xl font-bold'>@ISSA Corp</h1>
        <p className='m-12'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, suscipit?</p>
        <p className='font-[pacifico] '>Peter ISSA</p>
      </div>
      <div className='w-[50%] h-[80%] '>
        <form className='w-full h-full flex bg-white shadow-2xl justify-center gap-4 items-center flex-col' action="">
          <h1 className='text-4xl font-bold'>Contacter nous</h1>
          <input className='input input-primary bg-white' type="text" placeholder='Nom' />
          <input className='input input-primary bg-white' type="email" placeholder='Email' />
          <input className='input input-primary bg-white h-[20%] ' type="text" placeholder='Commentaires' />
          <button className='btn btn-success w-[20%] ' type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  )
}
