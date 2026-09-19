import React from 'react'
import { Link } from 'react-router-dom'
import CardProducts from './Users/products/ui/cardProduct'

export default function App() {
  return (
   <div>
    <h1>C'est mon application React !</h1>
    <Link to="/inscription">Inscription</Link>
    <CardProducts />
   </div>
  )
}

