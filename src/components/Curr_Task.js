import { getDatabase, ref, onValue, push as firebasePush } from 'firebase/database';
import { useState, useEffect } from 'react';

export function Curr_Task(props) {
  // state variable to track quote entered
  const [dateEntered, setDateEntered] = useState("");
  const [taskNameEntered, setTaskNameEntered] = useState("");
  const [estTimeEntered, setEstTimeEntered] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dateEmpty, setDateEmpty] = useState(true);
  const [estTimeEmpty, setEstTimeEmpty] = useState(true);
  const [taskNameEmpty, setTaskNameEmpty] = useState(true);

useEffect(() => {
  // what to do FIRST TIME the component loads
  // hook up listener for when a value changes
  const db = getDatabase();
  const allTasksDataRef = ref(db, "allTasksData"); // refers to "allAddedQuoteData" in the database

  // onValue() returns how to turn it back off
  //returns a function that will "unregister" (turn off) the listener
  const unregisterFunction = onValue(allTasksDataRef, (snapshot) => {
      const newTaskVal = snapshot.val();
  })

  //cleanup function for when component is removed
  function cleanup() {
      unregisterFunction(); //call the unregister function
  }
  return cleanup; //effect hook callback returns the cleanup function
}, [])

  const handleDateChange = (event) => {
    const dateValue = event.target.value;

    // disable button and display validation error message if enteredQuoteValue is empty
    if (dateValue == null || dateValue === "" || dateValue === undefined) {
      event.target.setCustomValidity("Today's date field cannot be empty.");
      setDateEmpty(true);
    } else {
      event.target.setCustomValidity("");
      setDateEmpty(false);
    }
    setErrorMessage(event.target.validationMessage);

    setDateEntered(dateValue);
  }
  const handleTaskNameChange = (event) => {
    const taskNameValue = event.target.value;

    // disable button and display validation error message if enteredQuoteValue is empty
    if (taskNameValue == null || taskNameValue === "" || taskNameValue === undefined) {
      event.target.setCustomValidity("Task Name field cannot be empty.");
      setTaskNameEmpty(true);
    } else {
      event.target.setCustomValidity("");
      setTaskNameEmpty(false);
    }
    setErrorMessage(event.target.validationMessage);

    setDateEntered(taskNameValue);
  }
  const handleEstTimeChange = (event) => {
    const estTimeValue = event.target.value;

    // disable button and display validation error message if enteredQuoteValue is empty
    if (estTimeValue == null || estTimeValue === "" || estTimeValue === undefined) {
      event.target.setCustomValidity("Today's date field cannot be empty.");
      setEstTimeEmpty(true);
    } else {
      event.target.setCustomValidity("");
      setEstTimeEmpty(false);
    }
    setErrorMessage(event.target.validationMessage);

    setDateEntered(estTimeValue);
  }


  const [status, setStatus] = useState(undefined);


  const handleCurrTaskSubmit = (event) => {
    event.preventDefault();

    const db = getDatabase();
    const newTaskData = {
      date: dateEntered,
      name: taskNameEntered,
      Est_Time: estTimeEntered
    }
    const allTasksData = ref(db, "allTasksData");
    firebasePush(allTasksData, newTaskData)
      .then(() => {
        setStatus({ type: 'success' });
      })
      .catch((error) => {
        setStatus({ type: 'error', error });
      });

    // set input data back to "" so it clears after submit
    setDateEntered("");
    setEstTimeEntered("");
    setTaskNameEntered("");
    setStatus(undefined);
  }

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
          <input type='date' className='input' name='date' required
          value={dateEntered} onChange={handleDateChange}/>
        </div>
        <div>
          <label for='name'>Task Name: </label>
          <input type='text' className='input' name='name' required
          value={taskNameEntered} onChange={handleTaskNameChange}/>
          <label for='time'>Estimated time: </label>
          <input type='time' className="input" name='time' required
          value={estTimeEntered} onChange={handleEstTimeChange} />
        </div>
      </form>
      <div className="error-message">{errorMessage}</div>
        <div className='center-flex'>
        {status?.type === 'success' && <p className="success-message">You have successfully added a new task!</p>}
        {status?.type === 'error' && (<p className="error-message">Oh no! There is an error.</p>)}
        </div>
      <button className="long-but" disabled={dateEmpty || estTimeEmpty || taskNameEmpty} onClick={handleCurrTaskSubmit}>Start</button>
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