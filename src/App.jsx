import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import Contact from './pages/Contact'
import Footer from './components/Footer'

const App = () => {



  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/about' element={<About/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/listing/:listingId" element={<Listing/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/contactUs' element={<Contact/>}/>
        <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/create-listing' element={<CreateListing/>}/>
        <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
        </Route>
      </Routes>
      <Footer/>
     </Router>
  )
}

export default App
