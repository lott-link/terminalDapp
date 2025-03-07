import React from 'react'
import CreateChanceRoom from  '../Pages/CreateChanceRoom/CreateChanceRoom'
import Contract from '../Pages/Contract/Contract'
import ChanceRoomList from '../Pages/ChanceRoomList/ChanceRoomList'
import ChanceRoomList_NFT from "../Pages/ChanceRoomList_NFT/ChanceRoomList";
import ChanceRoom from "../Pages/ChanceRoom/ChanceRoom";

// const CreateChanceRoom = React.lazy(()=>import('../Pages/CreateChanceRoom'))
// const Contract = React.lazy(()=>import('../Pages/Contract'))
// const ChanceRoomList = React.lazy(()=>import('../Pages/ChanceRoomList'))
// const ChanceRoom = React.lazy(()=>import('../Pages/ChanceRoom'))

const contractRoutes = [
  {
    path: "/contract",
    exact: false,
    component: Contract,
    title: "Contract",
    type: "directory",
    render: false,
    display: true,
  },
  {
    path: "/contract/createchanceroom",
    exact: true,
    component: CreateChanceRoom,
    title: "Chance_Room",
    type: "link",
    render: true,
    display: false,
  },
  {
    path: "/contract/chanceroomlist",
    exact: true,
    component: ChanceRoomList,
    title: "ChanceRoom_Cash",
    type: "link",
    render: true,
    display: true,
  },
  {
    path: "/contract/chanceroom/:address",
    exact: false,
    component: ChanceRoom,
    title: "Chance_Room",
    type: "link",
    render: true,
    display: false,
  },
  {
    path: "/contract/chanceroomlist_NFT",
    exact: true,
    component: ChanceRoomList_NFT,
    title: "Chance_Room_NFT",
    type: "link",
    render: true,
    display: true,
  },
];
export default contractRoutes;