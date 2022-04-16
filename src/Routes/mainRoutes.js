import React from 'react'
import HomePage from '../Pages/HomePage/HomePage'
import Contract from '../Pages/Contract/Contract'
import NFT from '../Pages/NFT/NFT'
import Tools from '../Pages/Tools/Tools'
import Assets from '../Pages/Assets/Assets'
import SigninRoot from '../Pages/SigninRoot/SigninRoot'
import ContactUs from '../Pages/ContactUs/ContactUs'
import Inbox from '../Pages/Inbox/Inbox'
import Dev from '../Pages/Dev/Dev'
import User from '../Pages/User/User'
// const HomePage = React.lazy(()=>import('../Pages/HomePage'))
// const Contract =  React.lazy(()=>import('../Pages/Contract'))
// const NFT = React.lazy(()=>import('../Pages/NFT'))
// const Tools = React.lazy(()=>import('../Pages/Tools'))
// const Assets = React.lazy(()=>import('../Pages/Assets'))
// const ContractPage = React.lazy(()=>import('../Pages/ContractPage'))
// const ContactUs = React.lazy(()=>import('../Pages/ContactUs'))
// const Inbox = React.lazy(()=>import('../Pages/Inbox'))
const mainRoutes = [
    {path:"/",exact:true,component:HomePage,title:"HomePage",type:'directory'},
    {path:'/signin',exact:false,component:SigninRoot,title:"sign_in",type:'directory'},
    {path:"/contract",exact:false,component:Contract,title:"Contract",type:'directory'},
    {path:"/nft",exact:false,component:NFT,title:"NFT",type:'directory'},
    {path:"/tools",exact:false,component:Tools,title:"tools",type:'directory'},
    {path:"/assets",exact:false,component:Assets,title:"Assets",type:'link'},
    {path:"/inbox",exact:false,component:Inbox,title:"Messenger",type:'link'},
    {path:"/contactus",exact:true,component:ContactUs,title:"Contact_us",type:'link'},
    {path:'/newmessage',exact:true,component:ContactUs,title:"new message"},
    {path:"/dev",exact:true,component:Dev,title:"Dev",type:'link'},
    {path:'/:user',exact:false,component:User,title:"user"}
]
export default mainRoutes;