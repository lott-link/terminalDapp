import React from 'react'
import { Route } from 'react-router-dom'
import firstPageRoutes from '../Routes/firstPageRoutes'
const firstPage = () => {
    return (
        <div className="w-100 h-100">
            {firstPageRoutes.map((route,index)=>{
                return <Route
                key={index}
                path={route.path} 
                exact={route.exact}
                render={props=> <route.component {...props}/>} />
            })}
        </div>
    )
}

export default firstPage
