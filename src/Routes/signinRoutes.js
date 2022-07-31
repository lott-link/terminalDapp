import React from "react";
import Register from "../Pages/Register/Register";
import EditProfile from "../Pages/EditProfile/EditProfile";
import SignInWithoutTemplate from "../Pages/SignInWithoutTemplate/SignInWithoutTemplate";

const signinRoutes = [
	{
		path: "/signin",
		exact: false,
		component: null,
		title: "Sign_in",
		type: "directory",
		render: false,
		display: true,
	},
	{
		path: "/signin/register",
		exact: true,
		component: Register,
		title: "Register",
		type: "link",
		render: true,
		display: true,
	},
	{
		path: "/signin/register_without_template",
		exact: true,
		component: SignInWithoutTemplate,
		title: "Register_without_template",
		type: "link",
		render: true,
		display: true,
	},
	{
		path: "/signin/editprofile",
		exact: true,
		component: EditProfile,
		title: "Edti_Profile",
		type: "link",
		render: true,
		display: true,
	},
];
export default signinRoutes;
