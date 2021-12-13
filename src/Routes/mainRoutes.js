import HomePage from "../Pages/HomePage"
import Contract from '../Pages/Contract'
import NFT from '../Pages/NFT'
const mainRoutes = [
    {path:"/",exact:true,component:HomePage,title:"HomePage",type:'directory'},
    {path:"/contract",exact:false,component:Contract,title:"Contract",type:'directory'},
    {path:"/nft",exact:false,component:NFT,title:"NFT",type:'directory'},
]
export default mainRoutes;