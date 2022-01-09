import React from 'react'
const HomePage = React.lazy(()=>import('../Pages/HomePage'))
const Contract =  React.lazy(()=>import('../Pages/Contract'))
const NFT = React.lazy(()=>import('../Pages/NFT'))
const NFTCrossChain = React.lazy(()=>import('../Pages/NFTCrossChain'))
const mainRoutes = [
    {path:"/",exact:true,component:HomePage,title:"HomePage",type:'directory'},
    {path:"/contract",exact:false,component:Contract,title:"Contract",type:'directory'},
    {path:"/nft",exact:false,component:NFT,title:"NFT",type:'directory'},
    {path:"/ctosschain",exact:true,component:NFTCrossChain,title:"Cross chain",type:'link'},
]
export default mainRoutes;