import React from 'react'
import { Route } from 'react-router-dom'
import contractRoutes from '../../Routes/contractRoutes'
const firstPage = () => {
    return (
        <div className="w-100 h-100">
            {contractRoutes.map((route,index)=>{
                if(route.render)
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
