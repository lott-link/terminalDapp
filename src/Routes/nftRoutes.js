import React from "react";
const NFTMint = React.lazy(()=>import('../Pages/NFTMint'))
const Assets = React.lazy(()=>import('../Pages/Assets'))
const nftRoutes = [
    {path:"/nft",exact:false,component:null,title:"NFT",type:'directory',render:false,display:true},
    {path:"/nft/mint",exact:true,component:NFTMint,title:"Mint",type:'link',render:true,display:true},
    {path:'/nft/assets',exact:true,component:Assets,title:"Assets",type:'link',render:true,display:true},
]
export default nftRoutes;