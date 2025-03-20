import React from 'react'
import {Link} from "react-router-dom";
// import PersonIcon from '@mui/icons-material/Person';
import './Header.css'




export default function Header() {
  return (
    <div className='heading'>
      {/* <PersonIcon/> */}
      <span >Task Manager</span>
      <ul>
        <li>
            <Link to={"/AddTask"}>Home</Link>
        </li>
        <li>
            <Link to={"/FilterTask"}>Filter</Link>
        </li>
      </ul>
    </div>
  )
}
