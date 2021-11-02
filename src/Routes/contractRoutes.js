import ContractPage from '../Pages/ContractPage';
import CreateChanceRoom from '../Pages/CreateChanceRoom'
import HomePage from "../Pages/HomePage"
import Contract from '../Pages/Contract'
import ChanceRoomList from '../Pages/ChanceRoomList';
import ChanceRoom from '../Pages/ChanceRoom';
const contractRoutes = [
    {path:"/contract",exact:false,component:Contract,title:"Contract",type:'directory',render:false,display:true},
    {path:'/contract/signin',exact:true,component:ContractPage,title:"Sign In",type:'link',render:true,display:true},
    {path:'/contract/createchanceroom',exact:true,component:CreateChanceRoom,title:"Chance Room",type:'link',render:true,display:true},
    {path:'/contract/chanceroomlist',exact:true,component:ChanceRoomList,title:"Chance Rooms",type:'link',render:true,display:true},
    {path:'/contract/chanceroom/:address',exact:false,component:ChanceRoom,title:"Chance Room",type:'link',render:true,display:false},
]
export default contractRoutes;