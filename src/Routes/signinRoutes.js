import React from "react";
import Signin from "../Pages/Signin/Signin";
import EditProfile from "../Pages/EditProfile/EditProfile";

const signinRoutes = [
    {path:"/signin",exact:false,component:null,title:"Sign_in",type:'directory',render:false,display:true},
    {path:"/signin/register",exact:true,component:Signin,title:"Register",type:'link',render:true,display:true},
    {path:"/signin/editprofile",exact:true,component:EditProfile,title:"Edti_Profile",type:'link',render:true,display:true},
]
export default signinRoutes;