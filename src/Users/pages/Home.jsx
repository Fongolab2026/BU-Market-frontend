import React from 'react'
import { Link } from 'react-router-dom'
import Products from '../products/products'

export default function Home() {
  return (
    <div>
      <h1>C'est mon application React !</h1>
      <Link to="/inscription">Inscription</Link>
      <Products />
    
    </div>
  )
}