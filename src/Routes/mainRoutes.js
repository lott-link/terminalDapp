import React from 'react'
const HomePage = React.lazy(()=>import('../Pages/HomePage'))
const NFT = React.lazy(()=>import('../Pages/NFT'))
const Assets = React.lazy(()=>import('../Pages/Assets'))

const mainRoutes = [
    {path:"/",exact:true,component:HomePage,title:"HomePage",type:'directory'},
    {path:"/nft",exact:false,component:NFT,title:"NFT",type:'directory'},
    {path:"/assets",exact:false,component:Assets,title:"Assets",type:'link'},
]
export default mainRoutes;