import React from 'react';
import { AddNewToDo } from './AddNewToDo';

export function Home(props) {

  const homeNewToDoMessage = "Start by typing a new to-do task";

  return (
    <div>
      <section id='home'>
        <img src='img/leaf.png' alt='leaf logo'></img>
        <h1>One Thing At A Time</h1>
        <h2>Focus on one thing at a time, get more done, and feel less stressed.</h2>

        <div className='home-to-do'>
          <AddNewToDo placeholderMsg={homeNewToDoMessage} currentUser={props.currentUser} />
        </div>

      </section>

      <div id="rabbit-row" className="repeatimg"></div>
    </div>

  )
}