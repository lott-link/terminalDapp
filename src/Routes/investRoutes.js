import BuyToken from "../Pages/Invest/BuyToken/BuyToken";
import Referral from "../Pages/Invest/Referral/Referral";

const investRoutes = [
	{
		path: "/invest",
		exact: false,
		component: null,
		title: "Invest",
		type: "directory",
		render: false,
		display: true,
	},
	{
		path: "/invest/buy_token",
		exact: true,
		component: BuyToken,
		title: "Buy Token",
		type: "link",
		render: true,
		display: true,
	},
    {
		path: "/invest/referral",
		exact: true,
		component: Referral,
		title: "Referral",
		type: "link",
		render: true,
		display: true,
	},
];
export default investRoutes;

