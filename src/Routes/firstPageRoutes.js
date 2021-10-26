import ContractPage from '../Pages/ContractPage';
import firstpage1 from '../Pages/firstPage1'
import firstpage2 from '../Pages/firstPage2'
const firstPageRoutes = [
    {path:'/contract',exact:true,component:ContractPage,title:"Contract"},
    {path:'/contract/1',exact:true,component:firstpage1,title:"first page first"},
    {path:'/contract/2',exact:true,component:firstpage2,title:"first page second"},
]
export default firstPageRoutes;