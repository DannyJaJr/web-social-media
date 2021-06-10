// Imports
import React, { Component, useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
// CSS
import './App.css';
// Components
import Welcome from './components/Welcome';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import About from './components/About';

//Private route component
// private route for  <PrivateRoute path='/profile' component={ Profile} user={currentUser} handleLogout={handleLogout} />
const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log('This is a private route...')
  //grab the token
  let user = localStorage.getItem('jwtToken');

   //to check to see if ther is a user inside the loalStorage
//     // {...rest} = for any information that ccomes in
  return <Route {...rest} render={ (props) => {
      return user ? <Component {...rest} {...props} /> : <Redirect to='/login' />
  }}/>
}



function App() {
  // Set state values
  const [currentUser, setCurrentUser] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  //useEffect to handle and store the token of the user
  useEffect(() => {
  let token; 
  //if ther is no token inide localStorage, then the user is not authenticated
  /// Now grab token with getItem at the localStorage
  if(!localStorage.getItem('jwtToken')){
    console.log('is not authenticated')
    setIsAuthenticated(false)
  }else {
   token =jwt_decode(localStorage.getItem('jwtToken'));
   console.log('token', token)
   setAuthToken(token) 
   setCurrentUser(token);
  }
  }, []);

  const nowCurrentUser = userData => {
    console.log('----- inside nowCurrentUser -----')
    setCurrentUser(userData);
    setIsAuthenticated(true);
  }

  // Now let'ss create a logout
  const handleLogout = () => {
    // determine if thereis ajwt
    /// if there is a token, then rmove it launch a logout
    if (localStorage.getItem('jwtToten')) {
      localStorage.removeItem('jwtToken')
      //now set the user to null
      setCurrentUser(null);
      setIsAuthenticated(false)
    }
  }

  return (
    <div className="App">
      {/* isAuth is located on the Navbar.js at the components */}
      <Navbar  isAuth={isAuthenticated} handleLogout={handleLogout} />
      <div className="container mt-5" >
        <Switch>
          {/* routes will go inside of here */}
          <Route path='/signup' component={ Signup } />
          {/* if props is used we have to use the render methode */}
          <Route path='/login' 
          render={(props) => <Login {...props} user={currentUser} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} />} />
          {/* now the path for About route */}
          <Route  path='/about' component={ About} />
          <Route exact path='/' component={ Welcome } />
          <PrivateRoute path='/profile' component={ Profile} user={currentUser} handleLogout={handleLogout} />
        </Switch>

      </div>
      
      <Footer />
    </div>
  );
}

export default App;
