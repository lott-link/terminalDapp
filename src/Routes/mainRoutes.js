import HomePage from "../Pages/HomePage"
import Contract from '../Pages/Contract'
const mainRoutes = [
    {path:"/",exact:true,component:HomePage,title:"HomePage",type:'directory'},
    {path:"/contract",exact:false,component:Contract,title:"Contract",type:'directory'},
]
export default mainRoutes;