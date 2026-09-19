
export default function Inscription() {
  return (
    <div className='flex justify-center h-screen p-1 items-center bg-[whitesmoke] '>
        <div className='w-105 h-155 rounded-md gap-3 flex flex-col p-10 bg-white shadow-md'>
          <h1 className='text-center text-[1.8rem] font-bold text-gray-700'>Céér un compte</h1>
          <form  className='flex flex-col'>
            <div className='mb-5 flex flex-col'>
              <label className='mb-5 flex text-[0.9rem] font-bold flex-col text-gray-700'>Nom complet :</label>
              <input className='input input-lg bg-gray-200 text-[0.9rem] text-gray-900 outline-none border-gray-200 w-85' type="text"  placeholder='Tapez votre nom...'
              />
            </div>
            <div className='mb-5 flex flex-col'>
              <label className='text-[0.9rem] mb-2 font-bold text-gray-700'>Email :</label>
              <input className='input input-lg bg-gray-200 text-[0.9rem] text-gray-900 outline-none border-gray-200  w-85' type="email"  placeholder='Tapez votre mail...'
                
              />
            </div>
            <div className='mb-5 flex flex-col'>
              <label className='text-[0.9rem] font-bold mb-2 text-gray-700'>Mot de passe :</label>
              <input  className='input input-lg bg-gray-200 text-[0.9rem] text-gray-900 outline-none border-gray-200 w-85' type="password" placeholder='Mot de passe...' 
               
              />
            </div>
             <div className='mb-5 flex flex-col'>
                <label className='text-[0.9rem] mb-2 font-bold text-gray-700'>Confirmation mot de passe :</label>
                <input className='input input-lg bg-gray-200 text-gray-900 text-[0.9rem] outline-none border-gray-200 w-85' type="password" placeholder='Tapez votre prenom'
                
              />
            </div>
            <div className=' text-center mt-3'>
              <button className='btn btn-primary w-85' type="submit">S'inscrire</button>
            </div>
          </form>
          <p className='text-center text-gray-500 text-[0.9rem]'>Déjà un compte ? <a className='text-blue-900' href="">Se connecter</a></p>
        </div>
      </div>
  )
}
