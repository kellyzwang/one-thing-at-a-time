import React from 'react';
import { Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

import { getAuth, signOut } from 'firebase/auth';


export function NavBar(props) {

    const currentUser = props.currentUser.userId;

    const currentUserName = props.currentUser.displayName;

    const handleSignOut = (event) => {
        signOut(getAuth());
    }


    return (

        <div>
            <header>

                <Navbar collapseOnSelect expand="lg" variant="light" className="color-nav fixed-top">
                    <Navbar.Brand as={Link} to="/home"><img src='img/leaf.png' alt='leaf logo' className="logo"></img>
                        <span>One Thing At A Time</span></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="container-fluid">
                            <Nav.Item>
                                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/to-do">To Do</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/focus">Focus</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/analysis">Analysis</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/motivation" className="navbar-right">Motivation</Nav.Link>
                            </Nav.Item>


                        </Nav>
                        <Nav>
                            {!currentUser &&
                                <Nav.Link as={Link} to="/signin" className="signin-margin">Sign In</Nav.Link>
                            }
                            {currentUser && <>
                                <Nav.Link to="/profile" className="signin-margin">Hi {currentUserName}!</Nav.Link>
                                <Nav.Link as={Link} to="/home" className="signin-margin signout-margin" onClick={handleSignOut}>Sign Out</Nav.Link>
                            </>
                            }
                        </Nav>
                    </Navbar.Collapse>

                </Navbar>
            </header>

        </div>
    )
}