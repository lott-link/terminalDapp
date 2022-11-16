import React from 'react'
import { Route } from 'react-router-dom'
import nftRoutes from '../../Routes/nftRoutes'
const NFT = () => {
    return (
        <div className="w-100 h-100">
            {nftRoutes.map((route,index)=>{
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

export default NFT
