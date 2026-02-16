import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Login from './Components/Login'
import Admin from './Components/Admin'
import Dashboard from './Components/Dashboard'
import User from './Components/User'
import Meeting from './Components/Meeting'
import Document from './Components/Document'
function App() {
  return (
    <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path =  '/admin' element = {<Admin/>} />
        <Route path =  '/dashboard' element = {<Dashboard/>} />
        <Route path = "/user" element = {<User/>} />
        <Route path = "/meetings" element = {<Meeting/>} />
        <Route path = "/documents" element = {<Document/>} />
    </Routes>

  )
}

export default App