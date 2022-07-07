import React from "react";
import CrossChain from '../Pages/NFTCrossChain/NFTCrossChain'
import AbiInputsGenerator from "../Pages/AbiInputsGenerator/AbiInputsGenerator";
import ReadOwnerOfContract from '../Pages/ReadOwnerOfContract/ReadOwnerOfContract'
// const CrossChain = React.lazy(()=>import('../Pages/NFTCrossChain'))
const toolsRoutes = [
    {path:"/tools",exact:false,component:null,title:"tools",type:'directory',render:false,display:true},
    {path:"/tools/transfer",exact:true,component:CrossChain,title:"transfer_nft",type:'link',render:true,display:true},
    {path:"/tools/crosschain",exact:true,component:CrossChain,title:"cross_chain",type:'link',render:true,display:true},
    {path:"/tools/AbiInputsGenerator",exact:true,component:AbiInputsGenerator,title:"ABI_Inputs_Generator",type:'link',render:true,display:true},
    // {path:"/tools/read_owner_of_contract",exact:true,component:ReadOwnerOfContract,title:"Read_Owner_Of_Contract",type:'link',render:true,display:true},
]
export default toolsRoutes;