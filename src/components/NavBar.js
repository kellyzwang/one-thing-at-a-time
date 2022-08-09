
import React from 'react';

export function NavBar() {

    return (
        <div>
        <header>
            <div>
                <img src='img/leaf.png' alt='leaf logo'></img>
                    <span>One Thing At A Time</span>
                    <nav>
                        <button id='home-btn'>Home</button>
                        <button id='yp-do-btn'>To Do</button>
                        <button id='focus-btn'>Focus</button>
                        <button id='analysis-btn'>Analysis</button>
                        <button id='motivation-btn'>Motivation</button>
                    </nav>
            </div>
            <button id='login-btn'>Log In</button>
        </header>
        </div>
    )
}