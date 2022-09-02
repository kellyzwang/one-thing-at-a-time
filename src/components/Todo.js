import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { ToDoList } from './ToDoList';
import { AddNewToDo } from './AddNewToDo';


export function Todo(props) {

  const current = new Date();
  const longMonth = current.toLocaleString('en-us', { month: 'long' });
  const Weekday = current.toLocaleString('en-us', { weekday: 'long' });

  const dateDisplay = `${Weekday}, ${longMonth} ${current.getDate()}, ${current.getFullYear()}`;

  const NewToDoMessage = "Type a new to-do task";

  return (
    <div>
      <section id='to-do-view'>
        <h1 className="dateDisplayText">Today is <strong className="dateDisplay">{dateDisplay}</strong>.</h1>
        <Form>
            <div className="container">

                <div className="heading-container">
                  <img src='img/green-rabbit.png' alt='green-rabbit logo'></img>
                  <h3>Add New To-Do Item: </h3>
                </div>

              <div className="margin-2em">
                <AddNewToDo placeholderMsg={NewToDoMessage} currentUser={props.currentUser}/>
              </div>
            </div>


        </Form>

        <div>


          <ToDoList ToDoData={props.ToDoData} currentUser={props.currentUser} />

        </div>
      </section>
    </div>
  )
}