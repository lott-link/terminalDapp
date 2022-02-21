import React from 'react'
const HomePage = React.lazy(()=>import('../Pages/HomePage'))
const Contract =  React.lazy(()=>import('../Pages/Contract'))
const NFT = React.lazy(()=>import('../Pages/NFT'))
const Tools = React.lazy(()=>import('../Pages/Tools'))
const Assets = React.lazy(()=>import('../Pages/Assets'))
const ContractPage = React.lazy(()=>import('../Pages/ContractPage'))
const ContactUs = React.lazy(()=>import('../Pages/ContactUs'))
const Inbox = React.lazy(()=>import('../Pages/Inbox'))
const mainRoutes = [
    {path:"/",exact:true,component:HomePage,title:"HomePage",type:'directory'},
    {path:'/signin',exact:true,component:ContractPage,title:"Sign_In",type:'link',render:true,display:true},
    {path:"/contract",exact:false,component:Contract,title:"Contract",type:'directory'},
    {path:"/nft",exact:false,component:NFT,title:"NFT",type:'directory'},
    {path:"/tools",exact:false,component:Tools,title:"tools",type:'directory'},
    {path:"/assets",exact:false,component:Assets,title:"Assets",type:'link'},
    {path:"/inbox",exact:false,component:Inbox,title:"Messenger",type:'link'},
    {path:"/contactus",exact:true,component:ContactUs,title:"Contact_us",type:'link'},
]
export default mainRoutes;