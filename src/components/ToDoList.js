import React, { useState, useEffect } from 'react';
import { getDatabase, onValue, ref, set as firebaseSet } from 'firebase/database';
import { Button } from 'react-bootstrap';


export function ToDoList(props) {



    const ToDoData = props.ToDoData;


    const [firebaseToDoData, setFirebaseToDoData] = useState([]);

    useEffect(() => {
        // what to do FIRST TIME the component loads

        const db = getDatabase();
        // refers to "allAddedToDoData" in the database for current user
        const allAddedToDoDataRef = ref(db, "allUserData/" + props.currentUser.uid + "/allAddedToDoData");

        const unregisterFunction = onValue(allAddedToDoDataRef, (snapshot) => {
            const newVal = snapshot.val();
            setFirebaseToDoData(newVal); // keep a copy of firebase allAddedToDoData
        })

        //cleanup function for when component is removed
        function cleanup() {
            unregisterFunction(); //call the unregister function
        }
        return cleanup;
    }, [props.currentUser.uid])

    // convert data into rows
    const rows = ToDoData.map((todo_item, index) => {
        return <ToDoDataRow key={index} todo_item={todo_item} index={index}
            firebaseToDoData={firebaseToDoData} currentUser={props.currentUser} />
    });



    return (
        <div>
            <div className="container">
                <div className="heading-container">
                    <img src='img/green-rabbit.png' alt='green-rabbit logo'></img>
                    <h3>To Do List: </h3>
                </div>
                <div>

                    <table className="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th>To-Do (Click on the text when you've completed the task!)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>


                </div>
            </div>
        </div>
    )
}



function ToDoDataRow({ index, todo_item, firebaseToDoData, currentUser }) {

    const handleRemoveButton = (event) => {
        event.preventDefault();
        const buttonValueOftheRow = event.target.value;

        const db = getDatabase();

        if (firebaseToDoData !== null) {
            const firebaseToDoDataNew = []
            for (const [key, value] of Object.entries(firebaseToDoData)) {
                let obj = { uniqueKey: key };
                for (const [k, v] of Object.entries(value)) {
                    if (k === "ToDoTask") {
                        obj.ToDoTask = v;
                    }
                }
                firebaseToDoDataNew.push(obj);
            }


            const delUniqueKey = firebaseToDoDataNew[buttonValueOftheRow].uniqueKey;
            const delRefString = "allUserData/" + currentUser.uid + "/allAddedToDoData/" + delUniqueKey;
            const delRef = ref(db, delRefString);
            firebaseSet(delRef, null);
        }
    }

    const handleCompleteOnClick = (event) => {
        if (event.target.style.textDecoration) {
            event.target.style.removeProperty('text-decoration');
          } else {
            event.target.style.setProperty('text-decoration', 'line-through');
          }
    }

    return (
        <tr>
            <td onClick={handleCompleteOnClick}>{todo_item.ToDoTask}</td>
            <td>
                <div>
                    <Button className="complete-remove-but" variant="outline-danger"
                        value={index} onClick={handleRemoveButton}>Remove</Button>
                </div>
            </td>
        </tr>
    );
}