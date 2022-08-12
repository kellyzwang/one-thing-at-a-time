import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import { getDatabase, ref, set as firebaseSet, onValue } from 'firebase/database';


export function QuoteManage() {
  const [quoteData, setQuoteData] = useState([]);
  const [firebaseQuoteData, setFirebaseQuoteData] = useState([]);

  useEffect(() => {
    // what to do FIRST TIME the component loads

    // hook up listener for when a value changes
    const db = getDatabase();
    const allAddedQuoteDataRef = ref(db, "allAddedQuoteData"); // refers to "allAddedQuoteData" in the database

    // onValue() returns how to turn it back off
    //returns a function that will "unregister" (turn off) the listener
    const unregisterFunction = onValue(allAddedQuoteDataRef, (snapshot) => {
      const newVal = snapshot.val();
      setFirebaseQuoteData(newVal); // keep a copy of firebase allAddedQuoteData


      // need to convert obj into array in order to setLabelArray() and setChartData()
      if (newVal !== null) {
        const keys = Object.keys(newVal);
        const newObjArray = keys.map((keyString) => {
          return newVal[keyString];
        })
        setQuoteData(newObjArray);
      } else {
        setQuoteData([]);
      }
    })

    //cleanup function for when component is removed
    function cleanup() {
      unregisterFunction(); //call the unregister function
    }
    return cleanup; //effect hook callback returns the cleanup function
  }, [])


  // convert data into rows
  const rows = quoteData.map((quote_item, index) => {
    return <QuoteDataRow key={index} quote_item={quote_item} index={index}
      firebaseQuoteData={firebaseQuoteData} />
  });


  return (
    <div>
      <section id="quote-manage-view">
        <div className="container">
          <div className="heading-container">
            <img src='img/red-rabbit.png' alt='red-rabbit logo'></img>
            <h3>All Added Quotes</h3>

          </div>
          <div className="container">

            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Quote</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>

          </div>
        </div>
      </section>
    </div>
  )
}


function QuoteDataRow({ quote_item, index, firebaseQuoteData }) {

  const handleRemoveButton = (event) => {
    event.preventDefault();
    const buttonValueOftheRow = event.target.value;

    const db = getDatabase();

    if (firebaseQuoteData !== null) {
      const firebaseQuoteDataNew = []
      for (const [key, value] of Object.entries(firebaseQuoteData)) {
        let obj = { uniqueKey: key };
        for (const [k, v] of Object.entries(value)) {
          if (k == "Quote") {
            obj.Quote = v;
          } 
        }
        firebaseQuoteDataNew.push(obj);
      }

      for (let i = 0; i < firebaseQuoteDataNew.length; i++) {
        if (buttonValueOftheRow === firebaseQuoteDataNew[i].Quote + index) {
          const delUniqueKey = firebaseQuoteDataNew[i].uniqueKey;
          const delRefString = "allAddedQuoteData/" + delUniqueKey;
          const delRef = ref(db, delRefString);
          firebaseSet(delRef, null);
        }
      }
    }
  }
  const buttonValue = quote_item.Quote + index;
  return (
    <tr>
      <td>{index}</td>
      <td>{quote_item.Quote}</td>
      <td>

        <Button outline color="danger" value={buttonValue} onClick={handleRemoveButton}>Remove</Button>
      </td>
    </tr>
  );
}