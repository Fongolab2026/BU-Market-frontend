import React from 'react'
import { Link } from 'react-router-dom'
import CardProducts from '../products/ui/cardProduct'

export default function Home() {
  return (
    <div>
      <h1>C'est mon application React !</h1>
      <Link to="/inscription">Inscription</Link>
      <CardProducts />
    </div>
  )
}