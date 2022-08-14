import React, { useState, useEffect } from 'react';
import { Todo } from './Todo.js';
import { Home } from './Home.js';
import { NavBar } from './NavBar.js';
import { Curr_Task } from './Curr_Task.js';
import { Analysis } from './Analysis.js';
import { Quote } from './Quote.js';
import { QuoteManage } from './QuoteManage.js'
import { Motivation } from './Motivation.js'
import { SignIn } from './SignIn.js'

import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';



function App(props) {

    const nullUser = { nuserId: null, userName: null }
    const [currentUser, setCurrentUser] = useState(nullUser);
    const navigateTo = useNavigate(); //for redirecting

    //effect to run when the component first loads
    useEffect(() => {

        const auth = getAuth();

        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) { //is defined, so "logged in"
                console.log(firebaseUser)

                //add in the keys for the terms we want to use
                firebaseUser.userId = firebaseUser.uid;
                firebaseUser.userName = firebaseUser.displayName;
                setCurrentUser(firebaseUser);
            }
            else { //not defined, so logged out
                setCurrentUser(nullUser);
            }
        });
    }, []) //array is list of variables that will cause this to rerun if changed


    const loginUser = (userObject) => {
        //can do more checking here if we want
        setCurrentUser(userObject);
        navigateTo('/home'); //go to chat "after" we log in!
    }



    return (
        <div>

            <Routes>
                <Route element={<AppLayout currentUser={currentUser} loginUser={loginUser} />}>
                    {/* protected routes, everything redirects to the sign in page */}

                    <Route element={<ProtectedPage currentUser={currentUser} />}>

                        <Route path="analysis" element={<Analysis />} />
                        <Route path="curr-task" element={<Curr_Task />} />
                        <Route path="motivation" element={<Motivation />} />
                        <Route path="quote-manage" element={<QuoteManage />} />
                        <Route path="to-do" element={<Todo />} />

                    </Route>

                    {/* public routes */}
                    <Route path="signin" element={<SignIn currentUser={currentUser} loginFunction={loginUser} />} />
                    <Route path='*' element={<Home />} />
                    <Route path="/" element={<Home />} />

                </Route>
            </Routes>

        </div>
    )
}

function AppLayout({ currentUser, loginUser }) {
    return (
        <>
            <NavBar currentUser={currentUser} loginFunction={loginUser} />
            {/* the nested route */}
            <Outlet />
        </>
    )
}

function ProtectedPage(props) {
    //...determine if user is logged in
    if(!props.currentUser.uid) { //if no user, send to sign in
      return <Navigate to="/signin" />
    }
    else { //otherwise, show the child route content
      return <Outlet />
    }
  }
  

export default App;
