import React from 'react'
import {Link} from "react-router-dom";
import './Header.css'

export default function Header() {
  return (
    <div className='heading'>
    
      <span >Task Manager</span>
      <ul>
        <li>
            <Link to={"/AddTask"}>
            <button className='naviagtion-btn'>Add task</button>
            </Link>
        </li>
        <li>
            <Link to={"/FilterTask"}>
               <button className='naviagtion-btn'>Filter task</button>
            </Link>
        </li>
      </ul>
    </div>
  )
}
