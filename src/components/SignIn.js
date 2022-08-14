import React from 'react';
import { getAuth, EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Navigate } from 'react-router-dom';

const FIREBASEUI_CONFIG_OBJ = {
    //what sign in options to show?
    signInOptions: [
        { provider: EmailAuthProvider.PROVIDER_ID, requireDisplayName: true },
        GoogleAuthProvider.PROVIDER_ID
    ],
    // for external sign-ins, show a popup login, don't redirect the page
    signInFlow: 'popup',
    callbacks: {
        //what do I do after I successfully sign in? just return false to NOT redirect
        signInSuccessWithAuthResult: () => false
    },
    //don't show an account chooser
    credentialHelper: 'none',
};

export function SignIn(props) {

    const auth = getAuth(); // the firebase authenticator


    // not working!!!!!!!!!!!
    const handleClick = (event) => {
        const whichUser = event.currentTarget.name //access button, not image
        const userObj = {
            userId: whichUser.toLowerCase() || null,
            userName: whichUser || null
        }
        props.loginFunction(userObj); //call the prop!
    }


    //if user is logged in, don't show the sign-in page but redirect instead
    if (props.currentUser.userId) {
        return <Navigate to="/home" />
    }

    return (
        <div className="signin-view">

            <div className="welcome-signin">
                <h1>Welcome to One Thing At A Time!</h1>
                <p>Sign in to use features like to do list, 
                    work time analysis, motivation, and focus on one thing at a time!</p>
            </div>

            <StyledFirebaseAuth firebaseAuth={auth}
                uiConfig={FIREBASEUI_CONFIG_OBJ} />
        </div>
    )
}