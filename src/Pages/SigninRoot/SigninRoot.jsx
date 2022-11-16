import React from 'react'
import { Route } from 'react-router-dom'
import signinRoutes from '../../Routes/signinRoutes'
const SigninRoot = () => {
  return (
    <div className="w-100 h-100">
        {signinRoutes.map((route,index)=>{
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

export default SigninRoot