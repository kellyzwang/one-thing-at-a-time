import { Quote } from './Quote';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export function Motivation() {

  const [quoteData, setQuoteData] = useState(null);

  // get quotes data from firebase!
  useEffect(() => {
    // what to do FIRST TIME the component loads
    // hook up listener for when a value changes
    const db = getDatabase();
    const allAddedQuoteDataRef = ref(db, "allAddedQuoteData"); // refers to "allAddedQuoteData" in the database

    // onValue() returns how to turn it back off
    //returns a function that will "unregister" (turn off) the listener
    const unregisterFunction = onValue(allAddedQuoteDataRef, (snapshot) => {
        const newQuotesVal = snapshot.val();

        // need to convert obj into array in order to setLabelArray() and setChartData()
        if (newQuotesVal !== null) {
            const keys = Object.keys(newQuotesVal);
            const newObjArray = keys.map((keyString) => {
                return newQuotesVal[keyString];
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

  return (
    <div>
      <Quote quoteData={quoteData} />
    </div>
  )
}