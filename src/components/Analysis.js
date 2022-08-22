import React from 'react';
import { getDatabase, ref, onValue, push as firebasePush } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto';


export function Analysis(props) {
  const today = new Date();
  const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()-7);
  const [toDate, setToDate] = useState(today.toISOString().split('T')[0]);
  const [fromDate, setFromDate] = useState(lastWeek.toISOString().split('T')[0]);
  const [totalTime, setTotalTime] = useState(0);
  const [firebaseTasksData, setFirebaseTasksData] = useState([{}]);
  const [tasksData, setTasksData] = useState([{}]);
  const [chartTaskData, setChartTaskData] = useState({
    labels: tasksData.map((task) => task.date),
      datasets: [{
          label:"Time focused",
          data: tasksData.map((task) => task.Actual_time),
      }]
  })

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


    //cleanup function for when component is removed
    function cleanup() {
      unregisterFunction(); //call the unregister function
    }
    return cleanup;
  }, [])


  const handleFromDateChange = (event) => {
    console.log(tasksData);

    const fromDateValue = event.target.value;
    if (fromDateValue != null && fromDateValue != "" && fromDateValue != undefined) {
      setFromDate(fromDateValue);
    } else {
    }
    setFromDate(fromDateValue);
  }
  const handleToDateChange = (event) => {
    const toDateValue = event.target.value;
if (toDateValue != null && toDateValue != "" && toDateValue != undefined) {
      setFromDate(toDateValue);
      event.target.setCustomValidity("");
    } else {
      event.target.setCustomValidity("");
    }
    setToDate(toDateValue);
  }



  const handleGraph = (event) => {
    var groupedTasks = [];
      tasksData.reduce(function(res, task) {
        if (!res[task.date]) {
          res[task.date] = { date: task.date, total_time: 0 };
          groupedTasks.push(res[task.date])
        }

        let split_actual_time = task.Actual_time.split(":");
        split_actual_time = split_actual_time.map(Number);
        let actual_time_second = split_actual_time[0]*3600 + split_actual_time[1]*60 + split_actual_time[2];

        res[task.date].total_time += actual_time_second;
        return res;
      }, {});

    setChartTaskData({
      labels: groupedTasks.map((task) => task.date),
      datasets: [{
          label:"Time focused",
          data: groupedTasks.map((task) => task.total_time),
          backgroundColor:'rgba(231,203,169)',
          borderRadius: 5,
          borderWidth: 30,

      }]
    })
  }


  return (
    <section>
      <div className="container">
      </div>
      <div className="container">
        {/* <p>Focus Time From {fromDate} To {toDate}</p> */}
        <div id="graph">
        <Bar data={chartTaskData}/>
        </div>
        <button onClick={handleGraph}>Apply Filter</button>

      </div>
      <div className="container">
        <label>From: </label>
        <input type='date' className='input' name='from' required
          value={fromDate} onChange={handleFromDateChange} />
        <label>To: </label>
        <input type='date' className="input" name='to' placeholder="" required
          value={toDate} onChange={handleToDateChange} />
      </div>

    </section>

  )
}
