import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function Inscrit() {
  const { register, handleSubmit, formState:{errors} } = useForm()
  const onSubmit = data =>{
    axios.post("http://localhost:3001/utilistateur", data).then((res)=>{
      console.log(res);
      toast.success("Inscriptio Reussis ")
    })
  }
  return (
    <div className='w-full h-screen bg-amber-100 flex justify-center items-center'>
      <div className='w-[35%] h-[60%] bg-amber-50 shadow-2xl'>
        <form className='w-full h-full flex  justify-center items-center flex-col gap-8' onSubmit={handleSubmit} action="">
          <h1 className='text-2xl font-bold'>Inscription</h1>
          <input className='input input-lg input-primary bg-white' type="text" placeholder='Prenom & Nom' {...register("Nom", {required:true})} />
          <input className='input input-lg input-primary bg-white' type="email" placeholder='Email' {...register("email", {required:true})} />
          <input className='input input-lg input-primary bg-white' type="password" placeholder='Password' {...register("password", {required:true, minLength:{value:6, message:"inserer plus de 6 caractère"}})} />
          <button className='btn btn-success btn-lg'>Envoyer</button>
        </form>
      </div>
    </div>
  )
}
