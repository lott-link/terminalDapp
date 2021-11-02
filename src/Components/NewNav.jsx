import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import mainRoutes from '../Routes/mainRoutes';
const NewNav = () => {
    const [navItem, setNavItem] = useState();
    const [routes,setRoutes] = useState()
    const history = useHistory()
    useEffect(()=>{
    },[])
    return (
        <div className="d-flex" id="navbar">
            {mainRoutes.map(route=><div className="text-white mx-1">{route.title}</div>)}
        </div>
    )
}

export default NewNav
