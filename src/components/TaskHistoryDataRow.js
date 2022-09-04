import { getDatabase, ref, set as firebaseSet } from 'firebase/database';
import React from 'react';
import { Button } from 'reactstrap';


export function TaskHistoryDataRow({ task, index, firebaseTaskData, currentUser }) {

    const handleRemoveButton = (event) => {
      event.preventDefault();
      const buttonValueOftheRow = event.target.value;
      const db = getDatabase();
      if (firebaseTaskData !== null) {
        const firebaseTaskDataNew = []
        for (const [key, value] of Object.entries(firebaseTaskData)) {
          let obj = { uniqueKey: key };
          for (const [k, v] of Object.entries(value)) {
            if (k === "name") {
              obj.name = v;
            } else if (k === "Est_Time") {
              obj.Est_Time = v;
            } else if (k === "Actual_time") {
              obj.Actual_time = v;
            }
          }
          firebaseTaskDataNew.push(obj);
        }
  
        const delUniqueKey = firebaseTaskDataNew[buttonValueOftheRow].uniqueKey;
        const delRefString = "allUserData/" + currentUser.uid + "/allTasksData/" + delUniqueKey;
        const delRef = ref(db, delRefString);
        firebaseSet(delRef, null);
      }
    }
    return (
  
      <tr key={index}>
        <td>{task.name}</td>
        <td className='date-row'>{task.date}</td>
        <td className='estTime-row'>{task.Est_Time}</td>
        <td className='actTime-row'>{task.Actual_time}</td>
        <td>
          <Button outline color="danger" value={index} onClick={handleRemoveButton}>Remove</Button>
        </td>
      </tr>
  
    );
  }