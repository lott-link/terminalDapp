import React from "react";
const CrossChain = React.lazy(()=>import('../Pages/NFTCrossChain'))
const Transfer = React.lazy(()=>import('../Pages/Transfer'))
const toolsRoutes = [
    {path:"/tools",exact:false,component:null,title:"tools",type:'directory',render:false,display:true},
    // {path:"/tools/transfer",exact:true,component:Transfer,title:"transfer nft",type:'link',render:true,display:true},
    {path:"/tools/transfer",exact:true,component:CrossChain,title:"transfer nft",type:'link',render:true,display:true},
    {path:"/tools/crosschain",exact:true,component:CrossChain,title:"cross chain",type:'link',render:true,display:true},
]
export default toolsRoutes;