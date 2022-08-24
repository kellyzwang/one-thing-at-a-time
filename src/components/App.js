import React, { useState, useEffect } from 'react';
import { Todo } from './Todo.js';
import { Home } from './Home.js';
import { NavBar } from './NavBar.js';
import { Curr_Task } from './Curr_Task.js';
import { Analysis } from './Analysis.js';
import { QuoteManage } from './QuoteManage.js'
import { Motivation } from './Motivation.js'
import { SignIn } from './SignIn.js'

import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';



function App() {

    const nullUser = { nuserId: null, userName: null }
    const [currentUser, setCurrentUser] = useState(nullUser);
    const navigateTo = useNavigate(); //for redirecting


    //effect to run when the component first loads
    useEffect(() => {

        const auth = getAuth();

        onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) { //is defined, so "logged in"

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

    // console.log("printing from App.js;",
    //             "currentUser is:", currentUser,
    //             "uid:", currentUser.uid)

    const loginUser = (userObject) => {
        setCurrentUser(userObject);
        navigateTo('/home'); //go to chat "after" we log in!
    }


    // get to do data from firebase for ToDo and Focus page:
    const [ToDoData, setToDoData] = useState([{}]);
    // get toDo data from firebase!
  useEffect(() => {

    const db = getDatabase();

    // refers to "allAddedToDoData" for current user in the database
    const allAddedToDoDataRef = ref(db, "allUserData/" + [currentUser.uid] + "/allAddedToDoData");

    const unregisterFunction = onValue(allAddedToDoDataRef, (snapshot) => {
      const newVal = snapshot.val();

      if (newVal !== null) {
        const keys = Object.keys(newVal);
        const newObjArray = keys.map((keyString) => {
          return newVal[keyString];
        })
        setToDoData(newObjArray);
      } else {
        setToDoData([]);
      }
    })

    //cleanup function for when component is removed
    function cleanup() {
      unregisterFunction(); //call the unregister function
    }
    return cleanup; //effect hook callback returns the cleanup function
  }, [currentUser.uid])


    return (
        <div>

            <Routes>
                <Route element={<AppLayout currentUser={currentUser} loginUser={loginUser} />}>
                    {/* protected routes, everything redirects to the sign in page */}

                    <Route element={<ProtectedPage currentUser={currentUser} />}>

                        <Route path="analysis" element={<Analysis currentUser={currentUser}/>} />
                        <Route path="curr-task" element={<Curr_Task currentUser={currentUser} ToDoData={ToDoData}/>} />
                        <Route path="motivation" element={<Motivation currentUser={currentUser}/>} />
                        <Route path="quote-manage" element={<QuoteManage currentUser={currentUser}/>} />
                        <Route path="to-do" element={<Todo currentUser={currentUser} ToDoData={ToDoData} />} />

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
