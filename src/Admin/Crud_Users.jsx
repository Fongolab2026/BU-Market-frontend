import React from 'react'

export default function Crud_Users() {
  return (
    <div className='text-black w-full h-screen bg-white flex justify-center '>
      {/* Aside bar */}
      <div className='w-[20%] h-full border'>

      </div>
      <section className='w-[80%] h-full flex justify-between p-4 flex-col gap-2'>
        <h1 className='text-2xl font-bold'>Utilisateurs</h1>
        <i>

        </i>
      {/* Milieu */}
      <section className='w-full h-full p-2 flex flex-col shadow-2xl'>
        {/* zone de recherches */}
        <div className='w-full h-[20%] flex justify-around'>
          <input type="search" name="" id="" placeholder='Rechercher Utilisateur' className='input input-lg bg-white w-[40%] '/>
          <button className='btn btn-primary'>+ Ajouter Utilisateurs</button>
        </div>

        <div className='w-full h-[90%] overflow-y-scroll'>
          <table className="w-full text-left border-collapse">
            {/* En-tête du tableau */}
          <thead>
            <tr className="border-b border-slate-200 text-black text-sm font-semibold">
              <th className="py-3 px-3 w-10">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
              </th>
              <th className="py-3 px-3">User</th>
              <th className="py-3 px-3">Email</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Last Active</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-200/70 text-sm text-slate-700'>
          {/* user1 */}
            <tr className="hover:bg-slate-100/50 transition-colors">
              <td className="py-3 px-3">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-3">
                  <img src="" alt="user" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  <span className="font-semibold text-slate-800">Users</span>
                </div>
              </td>
              <td className="py-3 px-3 text-slate-600">@example.com</td>
              <td className="py-3 px-3 text-slate-700 font-medium">Admin</td>
              <td className="py-3 px-3">
                <span className="inline-block bg-[#dcfce7] text-[#166534] px-2.5 py-0.5 rounded-md text-xs font-medium">
                  Active
                </span>
              </td>
              <td className="py-3 px-3 text-slate-600">5m ago</td>
              <td className="py-3 px-3 text-right">
                <div className="flex items-center justify-end gap-3 text-slate-500">
                  <button title="Edit" className="hover:text-blue-600 transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                  <button title="Delete" className="hover:text-red-600 transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </td>
            </tr>

            {/* user2 */}
            <tr className="hover:bg-slate-100/50 transition-colors">
              <td className="py-3 px-3">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              </td>
              <td className="py-3 px-3">
                <div className="flex items-center gap-3">
                  <img src="" alt="Amélie Dubois" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                  <span className="font-semibold text-slate-800">users</span>
                </div>
              </td>
              <td className="py-3 px-3 text-slate-600">@example.com</td>
              <td className="py-3 px-3 text-slate-700 font-medium">Admin</td>
              <td className="py-3 px-3">
                <span className="inline-block bg-[#dcfce7] text-[#166534] px-2.5 py-0.5 rounded-md text-xs font-medium">
                  Active
                </span>
              </td>
              <td className="py-3 px-3 text-slate-600">5m ago</td>
              <td className="py-3 px-3 text-right">
                <div className="flex items-center justify-end gap-3 text-slate-500">
                  <button title="Edit" className="hover:text-blue-600 transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                  <button title="Delete" className="hover:text-red-600 transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
      </section>
      
      </section>
    </div>
  )
}
