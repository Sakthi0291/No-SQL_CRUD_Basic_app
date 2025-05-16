import React from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import AddTask from './AddTask';
import FilterTask from './FilterTask';
import Header from './Header';


export default function App() {
  return (
    <div>
    <HashRouter>
     <Header/>
     {/* <AddTask/> */}
        <div className='router'>
     <Routes>
         <Route path='' element={<Navigate to='/AddTask' />}></Route>
         <Route path='/AddTask' element= {<AddTask/>}></Route>
         <Route path='/FilterTask' element={<FilterTask/>}></Route>

     </Routes>
    </div>
    </HashRouter>
  </div>
  )
}
