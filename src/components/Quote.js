import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { getDatabase, ref, push as firebasePush } from 'firebase/database';
import { NavLink } from 'react-router-dom';



export function Quote(props) {
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
    const allAddedQuoteData = ref(db, "allUserData/" + props.currentUser.uid + "/allAddedQuoteData");
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



  const [displayedQuote, setDisplayedQuote] = useState("Click the 'New Quote' button below to see quote of the day! :)");

  const handleNewQuoteSubmit = (event) => {
    event.preventDefault();
  
    let randomInt = null;
    if (props.quoteData.length !== 0) {
      randomInt = Math.floor(Math.random() * props.quoteData.length);;
    } 

    if (randomInt == null) {
      setDisplayedQuote("Oh no! There's no quotes in the database, try adding a new quote you like! :)");
    } else {
      const randomQuote = "\"" + props.quoteData[randomInt].Quote + "\"";
      setDisplayedQuote(randomQuote);
    }
  }



  return (
    <div>
      <section id="quote-view">
        <div className="container">
          <div className="heading-container">
            <img src='img/red-rabbit.png' alt='red-rabbit logo'></img>
            <h3>Quote of the day: </h3>
          </div>
          <p className="quotedisplay">{displayedQuote}
            <Button color="secondary" size="sm" className="long-but" onClick={handleNewQuoteSubmit}>New Quote</Button>
          </p>
        </div>
        <div className="container">
          <h3>Add a new Quote or Manage your quotes:</h3>

          <div className='center-input-buttons'>
            <div className='textarea-margin'>
              <textarea type='text' id='quote-input' placeholder="Type a new quote" required
                value={quoteEntered} onChange={handleQuoteChange} />

            </div>
            <div className="error-message">{errorMessage}</div>
            <div className='center-flex'>
              {status?.type === 'success' && <p className="success-message">You have successfully added a new quote!</p>}
              {status?.type === 'error' && (<p className="error-message">Oh no! There is an error.</p>)}
            </div>

            <Button color="secondary" size="sm"
              className="long-but" disabled={isDisabled} onClick={handleAddQuoteSubmit}>Add New Quote</Button>

            <NavLink to="/quote-manage">
              <Button color="secondary" size="sm" className="long-but">Manage New Quote</Button>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  )
}