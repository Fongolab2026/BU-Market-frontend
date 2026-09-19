
import { Link } from 'react-router-dom'

export default function Connexion() {
  return (
    <div className='flex justify-center min-h-screen p-4 items-center bg-base-100'>
        <div className='card w-105 gap-3 flex flex-col p-10'>
            <h1 className='text-center text-[1.8rem] text-gray-600 font-bold '>Se connecter</h1>
          <form className='flex flex-col'>
            <div className='mb-5 flex flex-col'>
              <label className='text-[0.9rem] mb-2 font-bold text-base-content'>Email :</label>
              <input className='input input-lg w-85' type="email" placeholder='Tapez votre mail...' />
            </div>
            <div className='mb-3 flex flex-col'>
              <label className='text-[0.9rem] font-bold mb-2 text-base-content'>Mot de passe :</label>
              <input className='input input-lg w-85' type="password" placeholder='Mot de passe...' />
            </div>
            <div className='flex justify-end mb-4'>
              <a className='text-[0.85rem] text-primary font-semibold' href="">Mot de passe oublié ?</a>
            </div>
            <div className='text-center'>
              <button className='btn btn-primary w-85' type="submit">Se connecter</button>
            </div>
          </form>
          <p className='text-center text-base-content/70 text-[0.9rem]'>Pas encore de compte ? <Link className='text-primary font-semibold' to="/inscription">S'inscrire</Link></p>
        </div>
      </div>
  )
}
