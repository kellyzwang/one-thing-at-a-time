import React from 'react';
import { getDatabase, ref, onValue, push as firebasePush } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Button } from 'reactstrap';
import { Chart as ChartJS } from 'chart.js/auto';
import { ToastBody } from 'reactstrap';


export function Analysis(props) {
  const today = new Date();
  const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
  const [toDate, setToDate] = useState(today);
  const [fromDate, setFromDate] = useState(lastWeek);
  const [totalTime, setTotalTime] = useState("");
  const [firebaseTasksData, setFirebaseTasksData] = useState([{}]);
  const [tasksData, setTasksData] = useState([{}]);
  const [chartTaskData, setChartTaskData] = useState({
    labels: tasksData.map((task) => task.date),
    datasets: [{
      label: "Time focused",
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
    const fromDateValue = event.target.value;
    setFromDate(new Date(fromDateValue));
  }

  const handleToDateChange = (event) => {
    const toDateValue = event.target.value;
    setToDate(new Date(toDateValue));
  }

  const handleTotalTime = (totalTimeSec) => {
    if (totalTimeSec < 3600) {
      let totalTimeMin = totalTimeSec / 60;
      totalTimeMin = Math.round(totalTimeMin * 10) / 10
      setTotalTime(totalTimeMin + " minutes");
    } else {
      let totalTimeHr = totalTimeSec / 3600;
      totalTimeHr = Math.round(totalTimeHr * 10) / 10
      setTotalTime(totalTimeHr + " hours");
    }
  }

  const handleApplyFilter = () => {
    var groupedTasks = [];
    let totalTimeSec = 0;
    tasksData.reduce(function (res, task) {
      let date = new Date(task.date);
      if (date >= fromDate && date <= toDate) {
        if (!res[task.date]) {
          res[task.date] = { date: task.date, total_time: 0 };
          groupedTasks.push(res[task.date])
        }
        let split_actual_time = task.Actual_time.split(":");
        split_actual_time = split_actual_time.map(Number);
        let actual_time_second = split_actual_time[0] * 3600 + split_actual_time[1] * 60 + split_actual_time[2];
        totalTimeSec += actual_time_second;
        res[task.date].total_time += actual_time_second;
      }
      return res;
    }, {});

    let orderedGroupedTasks = [];
    const date = new Date(fromDate);

    while (date <= toDate) {
      let dateString = date.toISOString().split('T')[0];
      let groupedTask = undefined;
      groupedTasks.map(task => {
        if (task.date == dateString) {
          groupedTask = task;
          return;
        }
      })
      if (groupedTask) {
        orderedGroupedTasks.push({ date: dateString, total_time: groupedTask.total_time });
      } else {
        orderedGroupedTasks.push({ date: dateString, total_time: 0 });
      }
      date.setDate(date.getDate() + 1);
    }

    setChartTaskData({
      labels: orderedGroupedTasks.map((task) => task.date),
      datasets: [{
        label: "Time focused",
        data: orderedGroupedTasks.map((task) => task.total_time),
        backgroundColor: 'rgba(231,203,169)',
        borderRadius: 5,

      }]
    })
    handleTotalTime(totalTimeSec);
  }


  return (
    <section id='analysis-view'>

      <div className="container">
        <div className="heading-container">
          <img src='img/light-brown-rabbit.png' alt='light-brown-rabbit logo'></img>
          <h3>Focus Time Analysis:</h3>
        </div>
        <div className="label-margin">
          <label>From: </label>
          <input type='date' className='input' name='from' required
            value={fromDate.toISOString().split('T')[0]} onChange={handleFromDateChange} max={toDate.toISOString().split('T')[0]} />
          <label>To: </label>
          <input type='date' className="input" name='to' placeholder="" required
            value={toDate.toISOString().split('T')[0]} onChange={handleToDateChange} max={today.toISOString().split('T')[0]} />

          <Button color="secondary" size="sm" className="long-but" onClick={handleApplyFilter}>Apply Filter</Button>
        </div>
      </div>
      <div className="container">
        <div id="graphContainer">
          <p>Focus Time From {fromDate.toISOString().split('T')[0]} To {toDate.toISOString().split('T')[0]}: </p>
          <h4>{totalTime}</h4>
          <div id="graph">
            <Bar data={chartTaskData} />
          </div>
        </div>
      </div>

    </section>

  )
}
