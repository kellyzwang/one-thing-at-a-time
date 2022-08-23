import { getDatabase, ref, onValue, push as firebasePush } from 'firebase/database';
import { useState, useEffect } from 'react';
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";


export function Curr_Task(props) {

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
  const [dateEmpty, setDateEmpty] = useState(false);
  const [estTimeEmpty, setEstTimeEmpty] = useState(true);
  const [taskNameEmpty, setTaskNameEmpty] = useState(true);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [firebaseTasksData, setFirebaseTasksData] = useState([{}]);
  const [tasksData, setTasksData] = useState([{}]);

  useEffect(() => {
    // what to do FIRST TIME the component loads
    // hook up listener for when a value changes
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

    //cleanup function for when component is removed
    function cleanup() {
      unregisterFunction(); //call the unregister function
    }
    return () => clearInterval(timerId);
  }, [timerStarted, second, minute, hour])

  const handleDateChange = (event) => {
    const dateValue = event.target.value;

    // disable button and display validation error message if enteredQuoteValue is empty
    if (dateValue == null || dateValue === "" || dateValue === undefined) {
      event.target.setCustomValidity("Date field cannot be empty.");
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

    // disable button and display validation error message if task name is empty
    if (taskNameValue == null || taskNameValue === "" || taskNameValue === undefined) {
      event.target.setCustomValidity("Task Name field cannot be empty.");
      setTaskNameEmpty(true);
    } else {
      event.target.setCustomValidity("");
      setTaskNameEmpty(false);
    }
    setErrorMessage(event.target.validationMessage);

    setTaskNameEntered(taskNameValue);
  }
  const handleEstTimeChange = (event) => {
    const estTimeValue = event;

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

    // set input data back to "" so it clears after submit
    setDateEntered("");
    setEstTimeEntered("");
    setTaskNameEntered("");
    setHour(0);
    setMinute(0);
    setSecond(0);
    setDateEmpty(true);
    setEstTimeEmpty(true);
    setTaskNameEmpty(true);
    setStatus(undefined);
  }

  const handleSelectedDate = event => {
    setSelectedDate(event.target.value);
  };

  const rows = tasksData.map((task, index) => {
    if (!selectedDate || task.date == selectedDate) {
      return (
        <tr key={index}>
          <td>{task.name}</td>
          <td>{task.Est_Time}</td>
          <td>{task.Actual_time}</td>
        </tr>);
    }
  });

  const dropDownChange = (event) => {

  }

  //console.log(dateEmpty ,estTimeEmpty ,taskNameEmpty, timerStarted)


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
              <label htmlFor='date'>Date: </label>
              <input type='date' className='input' name='date' required
                value={dateEntered} onChange={handleDateChange} />
            </div>
            <div>
              <label htmlFor='name'>Task Name: </label>
              <input type='text' className='input' name='name' required
                value={taskNameEntered} onChange={handleTaskNameChange} />


              <select onChange={dropDownChange}>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="custom">Type Your own</option>
              </select>

            </div>
            <div>
              <label htmlFor='time'>Estimated work time (how much time you plan to spend): </label>

              <DropdownList
                data={["0:30:0", "1:00:0", "1:30:0", "2:00:0", "2:30:0", 
                        "3:00:0", "3:30:0", "4:00:0", "4:30:0", "5:00:0", 
                        "5:30:0", "6:00:0", "6:30:0", "7:00:0", "7:30:0", 
                        "8:00:0"]}
                value={estTimeEntered}
                placeholder={"hh:mm:ss"}
                onSelect={handleEstTimeChange} 
              />
              {/*<input type='time' className="input" name='time' required
                value={estTimeEntered} onChange={handleEstTimeChange} />*/}
            </div>
          </form>
          <div className="error-message">{errorMessage}</div>
          <div className='center-flex'>
            {status?.type === 'success' && <p className="success-message">You have successfully added a new task!</p>}
            {status?.type === 'error' && (<p className="error-message">Oh no! There is an error.</p>)}
          </div>
          <button className="long-but" disabled={dateEmpty || estTimeEmpty || taskNameEmpty || timerStarted} onClick={startTimer}>Start/Continue Timer</button>
          <button className="long-but" disabled={dateEmpty || estTimeEmpty || taskNameEmpty || !timerStarted} onClick={stopTimer}>Stop Timer</button>
          <button className="long-but" disabled={timerStarted} onClick={handleCurrTaskSubmit}>Task Completed</button>
          <p>Time passed: {hour} hr: {minute} min: {second} sec</p>
        </div>
        <div className="container">
          <div className="heading-container">
            <img src='img/pink-rabbit.png' alt='pink-rabbit logo'></img>
            <h3>History: </h3>
          </div>
          <div>
            <label htmlFor='date'>Date: </label>
            <input type='date' className='input' name='date' onChange={handleSelectedDate} required />
            <div>
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Estimated Time</th>
                    <th>Actual Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}