import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { getDatabase, ref, push as firebasePush } from 'firebase/database';
import { NavLink } from 'react-router-dom';



export function Quote() {
  // state variable to track quote entered
  const [quoteEntered, setQuoteEntered] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const handleQuoteChange = (event) => {
    const enteredQuoteValue = event.target.value;

    // disable button and display validation error message if enteredQuoteValue is empty
    if (enteredQuoteValue == null || enteredQuoteValue == "" || enteredQuoteValue == undefined) {
      event.target.setCustomValidity("Quote cannot be empty.");
      setIsDisabled(true);
    } else {
      event.target.setCustomValidity("");
      setIsDisabled(false);
    }
    setErrorMessage(event.target.validationMessage);

    setQuoteEntered(enteredQuoteValue);
  }


  const [status, setStatus] = useState(undefined);


  const handleAddQuoteSubmit = (event) => {
    event.preventDefault();

    const db = getDatabase();
    const newQuoteData = {
      Quote: quoteEntered
    }
    const allAddedQuoteData = ref(db, "allAddedQuoteData");
    firebasePush(allAddedQuoteData, newQuoteData)
      .then(() => {
        setStatus({ type: 'success' });
      })
      .catch((error) => {
        setStatus({ type: 'error', error });
      });

    // set input data back to "" so it clears after submit
    setQuoteEntered("");
    setStatus(undefined);
  }


  return (
    <div>
      <section id="quote-view">
        <div className="container">
          <div className="heading-container">
            <img src='img/red-rabbit.png' alt='red-rabbit logo'></img>
            <h3>Quote of the day: </h3>
          </div>
          <p>Everything is hard</p>
          <Button color="secondary" size="sm" className="long-but">New Quote</Button>
        </div>
        <div className="container">
          <input type='text' id='quote-input' placeholder="Type a new quote" required
            value={quoteEntered} onChange={handleQuoteChange} />
            <div className="error-message">{errorMessage}</div>
            <div className='center-flex'>
            {status?.type === 'success' && <p className="success-message">You have successfully added a new quote!</p>}
            {status?.type === 'error' && (<p className="error-message">Oh no! There is an error.</p>)}
          </div>
          <Button color="secondary" size="sm"
            className="long-but" disabled={isDisabled} onClick={handleAddQuoteSubmit}>Add New Quote</Button>
          
        </div>
        <div className="container">
          <h3>View your added quotes or remove quote</h3>
          <NavLink to="/quote-manage">
            <Button color="secondary" size="sm" className="long-but">Manage New Quote</Button>
          </NavLink>
        </div>
      </section>
    </div>
  )
}