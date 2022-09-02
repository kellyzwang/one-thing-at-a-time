import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { getDatabase, ref, push as firebasePush } from 'firebase/database';
import { Link } from 'react-router-dom';


export function AddNewToDo(props) {

    const [toDoTaskEntered, setToDoTaskEntered] = useState("");
    const [status, setStatus] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);

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
        //event.preventDefault();

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
            <div className='input-group'>
                <input type='text' id='task-input' className="form-control" placeholder={props.placeholderMsg} required
                    value={toDoTaskEntered} onChange={handleAddNewTaskChange} />

                <div className="input-group-append new-to-do-button">
                    <Link to="/to-do" 
                          onClick={event => handleAddNewTaskSubmit(event)}>
                        <Button color="secondary" size="sm"
                            className="long-but"  disabled={isDisabled}>Add New To-Do</Button>
                    </Link>
                
                </div>
            </div>
            <div className="error-message">{errorMessage}</div>
            <div className='center-flex'>
                {status?.type === 'success' && <p className="success-message">You have successfully added a new to-do task!</p>}
                {status?.type === 'error' && (<p className="error-message">Oh no! There is an error. Please sign in to use this feature!</p>)}
            </div>
        </div>

    )
}