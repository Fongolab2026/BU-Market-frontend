
export default function Inscription() {
  return (
    <div className='flex justify-center min-h-screen p-4 items-center bg-base-100'>
        <div className='card w-105 gap-3 flex flex-col p-10'>
          <h1 className='text-center text-[1.8rem] font-bold text-base-content'>Créer un compte</h1>
          <form className='flex flex-col'>
            <div className='mb-5 flex flex-col'>
              <label className='mb-2 text-[0.9rem] font-bold text-base-content'>Nom complet :</label>
              <input className='input input-lg w-85' type="text" placeholder='Tapez votre nom...' />
            </div>
            <div className='mb-5 flex flex-col'>
              <label className='text-[0.9rem] mb-2 font-bold text-base-content'>Email :</label>
              <input className='input input-lg w-85' type="email" placeholder='Tapez votre mail...' />
            </div>
            <div className='mb-5 flex flex-col'>
              <label className='text-[0.9rem] font-bold mb-2 text-base-content'>Mot de passe :</label>
              <input className='input input-lg w-85' type="password" placeholder='Mot de passe...' />
            </div>
             <div className='mb-5 flex flex-col'>
                <label className='text-[0.9rem] mb-2 font-bold text-base-content'>Confirmation mot de passe :</label>
                <input className='input input-lg w-85' type="password" placeholder='Confirmez le mot de passe...' />
            </div>
            <div className='text-center mt-3'>
              <button className='btn btn-primary w-85' type="submit">S'inscrire</button>
            </div>
          </form>
          <p className='text-center text-base-content/70 text-[0.9rem]'>Déjà un compte ? <a className='text-primary font-semibold' href="">Se connecter</a></p>
        </div>
      </div>
  )
}
