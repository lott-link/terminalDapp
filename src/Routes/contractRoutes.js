import React from 'react'
const CreateChanceRoom = React.lazy(()=>import('../Pages/CreateChanceRoom'))
const Contract = React.lazy(()=>import('../Pages/Contract'))
const ChanceRoomList = React.lazy(()=>import('../Pages/ChanceRoomList'))
const ChanceRoom = React.lazy(()=>import('../Pages/ChanceRoom'))

const contractRoutes = [
    {path:"/contract",exact:false,component:Contract,title:"Contract",type:'directory',render:false,display:true},
    {path:'/contract/createchanceroom',exact:true,component:CreateChanceRoom,title:"Chance_Room",type:'link',render:true,display:false},
    {path:'/contract/chanceroomlist',exact:true,component:ChanceRoomList,title:"Chance_Rooms",type:'link',render:true,display:true},
    {path:'/contract/chanceroom/:address',exact:false,component:ChanceRoom,title:"Chance_Room",type:'link',render:true,display:false},
]
export default contractRoutes;