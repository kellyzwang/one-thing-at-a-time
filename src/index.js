import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from "firebase/app";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkavOgyouDOpfhpYv3MOyM3B1WPBTjaEE",
  authDomain: "one-thing-at-a-time-d3e12.firebaseapp.com",
  projectId: "one-thing-at-a-time-d3e12",
  storageBucket: "one-thing-at-a-time-d3e12.appspot.com",
  messagingSenderId: "75893138342",
  appId: "1:75893138342:web:24de15182c7b81f98e2567"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
        <App />
   </BrowserRouter>
);