import { getDatabase, ref, onValue, push as firebasePush, set as firebaseSet } from 'firebase/database';
import React, { useState, useRef, useEffect } from 'react';
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";
import { TaskHistoryDataRow } from './TaskHistoryDataRow'


export function Focus(props) {

  const current = new Date();

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  const todaysDate = formatDate(current);

  // state variable to track data entered
  const [dateEntered, setDateEntered] = useState(todaysDate);
  const [taskNameEntered, setTaskNameEntered] = useState("");
  const [estTimeEntered, setEstTimeEntered] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [estTimeEmpty, setEstTimeEmpty] = useState(true);
  const [taskNameEmpty, setTaskNameEmpty] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [disableTaskComplete, setDisableTaskComplete] = useState(true);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [firebaseTasksData, setFirebaseTasksData] = useState([{}]);
  const [tasksData, setTasksData] = useState([{}]);


  useEffect(() => {
    const db = getDatabase();
    const allTasksDataRef = ref(db, "allUserData/" + props.currentUser.uid + "/allTasksData");

    const unregisterFunction = onValue(allTasksDataRef, (snapshot) => {
      const newVal = snapshot.val();
      setFirebaseTasksData(newVal);

      if (newVal !== null) {
        const keys = Object.keys(newVal);
        const newObjArray = keys.map((keyString) => {
          return newVal[keyString];
        })
        setTasksData(newObjArray);
      }
    })

    let timerId = null;
    if (timerStarted) {
      timerId = setInterval(function () {
        setSecond(second => second + 1);
        if (second == 60) {
          setMinute(minute => minute + 1);
          setSecond(0);
          if (minute == 60) {
            setHour(hour => hour + 1);
            setMinute(0);
          }
        }
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    function cleanup() {
      unregisterFunction();
    }
    return () => clearInterval(timerId);
  }, [timerStarted, second, minute, hour])

  const handleDateChange = (event) => {
    const dateValue = event.target.value;

    // disable button and display validation error message if enteredQuoteValue is empty
    if (dateValue == null || dateValue === "" || dateValue === undefined) {
      event.target.setCustomValidity("Date field cannot be empty.");
    } else {
      event.target.setCustomValidity("");
    }
    setErrorMessage(event.target.validationMessage);

    setDateEntered(dateValue);
  }

  const handleEstTimeChange = (event) => {
    const estTimeValue = event;
    //estTimeEntered == null || estTimeEntered === "" || estTimeEntered === undefined
    // disable button and display validation error message
    if (estTimeValue == null || estTimeValue === "" || estTimeValue === undefined) {
      //event.target.setCustomValidity("Estimated time field cannot be empty.");
      setErrorMessage("Estimated time field cannot be empty.");

      setEstTimeEmpty(true);
    } else {
      //event.target.setCustomValidity("");
      setErrorMessage("");
      setEstTimeEmpty(false);
    }
    //setErrorMessage(event.target.validationMessage);

    setEstTimeEntered(estTimeValue);
  }


  const startTimer = (event) => {
    setTimerStarted(true);
  }

  const stopTimer = (event) => {
    setTimerStarted(false);
    setDisableTaskComplete(false);
  }

  const [status, setStatus] = useState(undefined);

  const handleCurrTaskSubmit = (event) => {
    event.preventDefault();
    const db = getDatabase();
    const newTaskData = {
      date: dateEntered,
      name: taskNameEntered,
      Est_Time: estTimeEntered,
      Actual_time: hour + ":" + minute + ":" + second
    }
    const allTasksData = ref(db, "allUserData/" + props.currentUser.uid + "/allTasksData");
    firebasePush(allTasksData, newTaskData)
      .then(() => {
        setStatus({ type: 'success' });
      })
      .catch((error) => {
        setStatus({ type: 'error', error });
      });

    // set input data back to default so it clears after submit
    setDateEntered(todaysDate);
    setEstTimeEntered("");
    setTaskNameEntered("");
    setHour(0);
    setMinute(0);
    setSecond(0);
    setEstTimeEmpty(true);
    setTaskNameEmpty(true);
    setDisableTaskComplete(true);
    setStatus(undefined);
  }

  const handleSelectedDate = event => {
    setSelectedDate(event.target.value);
  };

  const rows = tasksData.map((task, index) => {
    if (firebaseTasksData == null) {
      return;
    }
    if (!selectedDate || task.date == selectedDate) {
      return (
        <TaskHistoryDataRow index={index}
          key={index}
          task={task}
          firebaseTaskData={firebaseTasksData}
          currentUser={props.currentUser} />
      );
    }
  });


  //// Task Name input box and handle change ////
  const options = props.ToDoData.map((obj) => {
    return obj.ToDoTask;
  })

  const ulRef = useRef();
  const inputRef = useRef();
  useEffect(() => {
    let focusPage = document.getElementById('curr-task-view');
    focusPage.addEventListener('click', (event) => {
      ulRef.current.style.display = 'none';
    });

    inputRef.current.addEventListener('click', (event) => {
      event.stopPropagation();
      ulRef.current.style.display = 'flex';
      handleTextChange(event);
    });

  }, [])


  const handleTextChange = (event) => {
    const taskNameValue = event.target.value;
    if (taskNameValue == null || taskNameValue === "" || taskNameValue === undefined) {
      event.target.setCustomValidity("Task Name field cannot be empty.");
      setTaskNameEmpty(true);
    } else {
      event.target.setCustomValidity("");
      setTaskNameEmpty(false);
      ulRef.current.style.display = 'none';
    }
    setErrorMessage(event.target.validationMessage);

    setTaskNameEntered(taskNameValue);
  }



  return (
    <div>
      <section id="curr-task-view">
        <div className="container">

          <div className="heading-container">
            <img src='img/pink-rabbit.png' alt='pink-rabbit logo'></img>
            <h3>Current Tasks:</h3>
          </div>
          <div className="margin-2em">
            <form>
              <div>
                <label htmlFor='date'>Date: </label>
                <input type='date' className='input' name='date' required
                  value={dateEntered} onChange={handleDateChange} />
              </div>
              <div>
                <label htmlFor='name'>Task Name: </label>
                <div>
                  <input
                    className='search-bar-dropdown form-control'
                    placeholder="Type in a task name or choose one from your to-do list"
                    onChange={handleTextChange}
                    ref={inputRef}
                    value={taskNameEntered}
                    type='text' />

                  <ul ref={ulRef} className='list-group'>
                    {options.map((option, index) => {
                      return (
                        <div key={index} className='suggestions-style'>
                          <button
                            type="button"
                            className='list-group-item list-group-item-action'
                            key={index}
                            onClick={(event) => {
                              inputRef.current.value = option;
                              setTaskNameEntered(option);
                              setTaskNameEmpty(false);
                              if (inputRef.current.value == null || inputRef.current.value === "" || inputRef.current.value === undefined) {
                                event.target.setCustomValidity("Task Name field cannot be empty.");
                                setTaskNameEmpty(true);
                              } else {
                                event.target.setCustomValidity("");
                                setTaskNameEmpty(false);
                                ulRef.current.style.display = 'none';
                              }
                              setErrorMessage(event.target.validationMessage);
                            }}>
                            {option}
                          </button>
                        </div>
                      );
                    })}
                  </ul>

                </div>

              </div>
              <div>
                <label htmlFor='time'>Estimated work time (how much time you plan to spend): </label>

                <DropdownList
                  data={["0:5:0", "0:10:0", "0:15:0", "0:20:0", "0:30:0",
                    "0:45:0", "1:00:0", "1:30:0", "2:00:0", "2:30:0",
                    "3:00:0", "3:30:0", "4:00:0", "4:30:0", "5:00:0",
                    "5:30:0", "6:00:0", "6:30:0", "7:00:0", "7:30:0",
                    "8:00:0"]}
                  defaultValue=""
                  value={estTimeEntered}
                  placeholder={"hh:mm:ss"}
                  onSelect={handleEstTimeChange}
                />

              </div>
            </form>
            <div className="error-message">{errorMessage}</div>
            <div className='center-flex'>
              {status?.type === 'success' && <p className="success-message">You have successfully entered a new completed task!</p>}
              {status?.type === 'error' && (<p className="error-message">Oh no! There is an error.</p>)}
            </div>
            <div className='timer-buttons'>
              <button className="long-but" disabled={estTimeEmpty || taskNameEmpty || timerStarted} onClick={startTimer}>Start/Continue Timer</button>
              <button className="long-but" disabled={estTimeEmpty || taskNameEmpty || !timerStarted} onClick={stopTimer}>Stop Timer</button>
              <button className="long-but" disabled={disableTaskComplete} onClick={handleCurrTaskSubmit}>Task Completed</button>

              <h1>Time passed: {hour} hr: {minute} min: {second} sec</h1>
            </div>
          </div>
        </div>
        <div className="container">

          <div className="heading-container curr-task-heading">
            <img src='img/pink-rabbit.png' alt='pink-rabbit logo'></img>
            <h3>History:</h3>
          </div>
          <div className="margin-2em">
            <div>
              <form className="history-date">
                <label htmlFor='date'>Date: </label>
                <input type='date' className='input' name='date' onChange={handleSelectedDate} required />
              </form>
              <div>
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>Task Name</th>
                      <th className='date-row'>Date</th>
                      <th className='estTime-row'>Estimated Time</th>
                      <th className='actTime-row'>Actual Time</th>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}