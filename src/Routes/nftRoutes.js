import React from "react";
import NFTMint from "../Pages/NFTMint/NFTMint";
import ViewNFT from "../Pages/ViewNFT/ViewNFT";
// const NFTMint = React.lazy(()=>import('../Pages/NFTMint'))
const nftRoutes = [
	{
		path: "/nft",
		exact: false,
		component: null,
		title: "NFT",
		type: "directory",
		render: false,
		display: true,
	},
	{
		path: "/nft/mint",
		exact: true,
		component: NFTMint,
		title: "Mint",
		type: "link",
		render: true,
		display: true,
	},
	{
		path: "/nft/view_nft",
		exact: true,
		component: ViewNFT,
		title: "View NFT",
		type: "link",
		render: true,
		display: true,
	},
];
export default nftRoutes;
