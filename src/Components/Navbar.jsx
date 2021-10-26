import { useState, useEffect } from 'react'
import { Link,useHistory } from 'react-router-dom'
import mainRoutes from '../Routes/mainRoutes'
import firstPageRoutes from '../Routes/firstPageRoutes'
const Navbar = () => {
    const [navItems,setNavItems] = useState()
    const [enableBack,setEnableBack] = useState(false)
    const [pathName,setPathName] = useState()
    const history = useHistory()
      history.listen((location)=>{
        setPathName(location.pathname)
        switch(location.pathname){
          case '/':
            setNavItems([...mainRoutes])
            setEnableBack(false)
            break;
          case '/contract':
            setNavItems([...firstPageRoutes])
            setEnableBack(true)
            break;
          case '/second':
            setNavItems([...mainRoutes])
            setEnableBack(false)
            break; 
        }
      })
    useEffect(()=>{
      setNavItems(mainRoutes)
    },[])
    return (
        <nav className="d-flex" id="navbar">
          { enableBack && <Link to="/" className="text-white mx-2" >back</Link>}
          {
            navItems && navItems.map((item,index)=><div key={Math.random()*1000} className="mx-2">
              <Link to={item.path} className={pathName===item.path ? "selected-nav-item" : ""}>{item.title}</Link>
            </div>)
          }
        </nav>
    )
}

export default Navbar
