import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function Inscription() {
  const {handleSubmit, register,formState: {errors}} = useForm();
  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <div className='flex justify-center min-h-screen p-4 items-center bg-base-100'>
        <div className='card w-105 gap-3 flex flex-col p-10'>
          <h1 className='text-center text-[1.8rem] text-gray-600 font-bold '>Créer un compte</h1>
          <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-5 flex flex-col'>
              <label className='mb-2 text-[0.9rem] font-bold text-gray-600'>Nom complet :</label>
              <input className='input input-lg w-85 outline-0 border-gray-300'  type="text" placeholder='Tapez votre nom...' />
            </div>
            <div className='mb-5 flex flex-col'>
              <label className='text-[0.9rem] mb-2 font-bold text-gray-600'>Email :</label>
              <input className='input input-lg w-85 outline-0 border-gray-300' type="email" placeholder='Tapez votre mail...' />
            </div>
            <div className='mb-5 flex flex-col'>
              <label className='text-[0.9rem] font-bold mb-2 text-gray-600'>Mot de passe :</label>
              <input className='input input-lg w-85 outline-0 border-gray-300' type="password" placeholder='Mot de passe...' />
            </div>
             <div className='mb-5 flex flex-col'>
                <label className='text-[0.9rem] mb-2 font-bold text-gray-600'>Confirmation mot de passe :</label>
                <input className='input input-lg w-85 outline-0 border-gray-300' type="password" placeholder='Confirmez le mot de passe...' />
            </div>
            <div className='text-center mt-3'>
              <button className='btn btn-primary w-85' type="submit">S'inscrire</button>
            </div>
          </form>
          <p className='text-center text-base-content/70 text-[0.9rem]'>Déjà un compte ? <Link className='text-primary font-semibold' to="/connexion">Se connecter</Link></p>
        </div>
      </div>
  )
}