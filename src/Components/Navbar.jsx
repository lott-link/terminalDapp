import { useState, useEffect } from 'react'
import { Link,useHistory } from 'react-router-dom'
import mainRoutes from '../Routes/mainRoutes'
import firstPageRoutes from '../Routes/firstPageRoutes'
const Navbar = () => {
    const [navItems,setNavItems] = useState()
    const [enableBack,setEnableBack] = useState(false)
    const history = useHistory()
    const handleBack = ()=>{
      history.push('/')
      setNavItems(mainRoutes)
      setEnableBack(false)
    }
    useEffect(()=>{
      setNavItems(mainRoutes)
      history.listen((location)=>{
        switch(location.pathname){
          case '/':
            setNavItems(mainRoutes)
            setEnableBack(false)
            break;
          case '/contract':
            setNavItems(firstPageRoutes)
            setEnableBack(true)
            break;
          case '/second':
            setNavItems(mainRoutes)
            setEnableBack(false)
            break;
        }
      })
    },[])
    return (
        <nav className="d-flex" id="navbar">
          { enableBack && <Link to="/" className="text-white mx-2" >back</Link>}
          {
            navItems && navItems.map((item,index)=><div key={index*10} className="mx-2"><Link to={item.path}>{item.title}</Link></div>)
          }
        </nav>
    )
}

export default Navbar
