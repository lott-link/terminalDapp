import homePage from "../Pages/homePage"
import firstPage from "../Pages/firstPage"
import secondPage from "../Pages/secondPage"
const mainRoutes = [
    {path:"/",exact:true,component:homePage,title:"Homepage"},
    {path:"/contract",exact:false,component:firstPage,title:"Contract"},
    {path:"/second",exact:true,component:secondPage,title:"secondPage"},
]
export default mainRoutes;