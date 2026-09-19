import React from 'react'
import { Link } from 'react-router-dom'

export default function App() {
  return (
   <div>
    <h1>C'est mon application React !</h1>
    <Link to="/inscription">Inscription</Link>
   </div>
  )
}

