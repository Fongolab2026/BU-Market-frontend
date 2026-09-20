import React from 'react'
import { Link } from 'react-router-dom'
import CardProducts from '../products/ui/cardProduct'
import NavBar from '../Composants/nav'
import Products from '../products/products'

export default function Home() {
  return (
    <div className='min-h-screen bg-base-100'>
      <NavBar />
      <div className='mx-auto max-w-7xl p-6'>
        <Link to="/inscription" className='text-primary'>Inscription</Link>
        
        <Products />
      </div>
    </div>
  )
}
