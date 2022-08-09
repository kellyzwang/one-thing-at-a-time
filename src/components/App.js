import React, { useState, useEffect } from 'react';
import { Todo } from './Todo.js';
import { Home } from './Home.js';
import { NavBar } from './NavBar.js';
import { Curr_Task } from './Curr_Task.js';
import { Analysis } from './Analysis.js';
import { Quote } from './Quote.js';
import { QuoteManage } from './QuoteManage.js'

import { Routes, Route } from 'react-router-dom';



function App(props) {



    return (
        <div>
            <NavBar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="curr-task" element={<Curr_Task />} />
                <Route path="quote" element={<Quote />} />
                <Route path="quote-manage" element={<QuoteManage />} />
                <Route path="todo" element={<Todo />} />
                <Route path='*' element={<Home />} />
            </Routes>
            
        </div>
    )
}

export default App;
