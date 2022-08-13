import React from 'react';
import { Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

export function NavBar(props) {
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
                                <Nav.Link as={Link} to="/curr-task">Focus</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/analysis">Analysis</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/motivation" className="navbar-right">Motivation</Nav.Link>
                            </Nav.Item>


                        </Nav>
                        <Nav>
                            <Nav.Link as={Link} to="/login" className="login-margin">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>

                </Navbar>
            </header>

        </div>
    )
}