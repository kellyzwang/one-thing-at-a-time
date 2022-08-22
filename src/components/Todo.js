import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push as firebasePush } from 'firebase/database';
import { Button, Form } from 'react-bootstrap';
import { ToDoList } from './ToDoList';


export function Todo(props) {

  const [ToDoData, setToDoData] = useState([{}]);
  const [toDoTaskEntered, setToDoTaskEntered] = useState("");
  const [status, setStatus] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);


  // get toDo data from firebase!
  useEffect(() => {

    const db = getDatabase();

    // refers to "allAddedToDoData" for current user in the database
    const allAddedToDoDataRef = ref(db, "allUserData/" + [props.currentUser.uid] + "/allAddedToDoData");

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
  }, [props.currentUser.uid])


  const current = new Date();
  const longMonth = current.toLocaleString('en-us', { month: 'long' });
  const Weekday = current.toLocaleString('en-us', { weekday: 'long' });

  const dateDisplay = `${Weekday}, ${longMonth} ${current.getDate()}, ${current.getFullYear()}`;


  const handleAddNewTaskChange = (event) => {
    const enteredValue = event.target.value;

    // disable button and display validation error message if enteredValue is empty
    if (enteredValue == null || enteredValue == "" || enteredValue == undefined) {
      event.target.setCustomValidity("To-do task cannot be empty.");
      setIsDisabled(true);
    } else {
      event.target.setCustomValidity("");
      setIsDisabled(false);
    }
    setErrorMessage(event.target.validationMessage);

    setToDoTaskEntered(enteredValue);
  }

  const handleAddNewTaskSubmit = (event) => {
    event.preventDefault();

    const db = getDatabase();
    const newToDoData = {
      ToDoTask: toDoTaskEntered
    }
    const allAddedToDoDataRef = ref(db, "allUserData/" + props.currentUser.uid + "/allAddedToDoData");
    firebasePush(allAddedToDoDataRef, newToDoData)
      .then(() => {
        setStatus({ type: 'success' });
      })
      .catch((error) => {
        setStatus({ type: 'error', error });
      });

    // set input data back to "" so it clears after submit
    setToDoTaskEntered("");
    setStatus(undefined);
  }



  return (
    <div>
      <section id='to-do-view'>
        <div>

          <h1 className="dateDisplayText">Today is <strong className="dateDisplay">{dateDisplay}</strong>.</h1>
          <ToDoList ToDoData={ToDoData} currentUser={props.currentUser}/>

        </div>

        <Form>
          <Form.Group>
            <div className="container">
              <div className="heading-container">
                <Form.Label><h3>Add New To-Do:</h3></Form.Label>

              </div>
              <input type='text' id='task-input' placeholder="Type a new to-do task" required
                value={toDoTaskEntered} onChange={handleAddNewTaskChange} />
              <div className="error-message">{errorMessage}</div>
              <div className='center-flex'>
                {status?.type === 'success' && <p className="success-message">You have successfully added a new to-do task!</p>}
                {status?.type === 'error' && (<p className="error-message">Oh no! There is an error.</p>)}
              </div>
              <Button color="secondary" size="sm"
                className="long-but" disabled={isDisabled} onClick={handleAddNewTaskSubmit}>Add New To-do</Button>

            </div>

          </Form.Group>

        </Form>
      </section>
    </div>
  )
}