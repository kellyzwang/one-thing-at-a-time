import React from 'react';

export function Curr_Task() {


  return (
    <div>
      <section id="curr-task-view">
      <div className="container">
        <div className="heading-container">
          <img src='img/pink-rabbit.png' alt='pink-rabbit logo'></img>
          <h3>Current Tasks: </h3>
        </div>
        <form>
          <div>
            <label for='date'>Today's Date: </label>
            <input type='date' className='input' name='date' required />
          </div>
          <div>
            <label for='name'>Task Name: </label>
            <input type='text' className='input' name='name' required />
            <label for='time'>Estimated time: </label>
            <input type='time' className="input" name='time' required />
          </div>
        </form>
        <button className="long-but">Start</button>
      </div>
        <div className="container">
          <div className="heading-container">
            <img src='img/pink-rabbit.png' alt='pink-rabbit logo'></img>
            <h3>History: </h3>
          </div>
          <div>
            <label for='date'>Today's Date: </label>
            <input type='date' className='input' name='date' required />
          </div>
        </div>
      </section>
    </div>
  )
}