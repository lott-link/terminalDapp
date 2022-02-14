import React from "react";
const CrossChain = React.lazy(()=>import('../Pages/NFTCrossChain'))
const toolsRoutes = [
    {path:"/tools",exact:false,component:null,title:"tools",type:'directory',render:false,display:true},
    {path:"/tools/transfer",exact:true,component:CrossChain,title:"transfer_nft",type:'link',render:true,display:true},
    {path:"/tools/crosschain",exact:true,component:CrossChain,title:"cross_chain",type:'link',render:true,display:true},
]
export default toolsRoutes;