import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import mainRoutes from "../Routes/mainRoutes";
import contractRoutes from "../Routes/contractRoutes";
import play from '../Assetes/play.svg'
const Navbar = () => {
  const [navItems, setNavItems] = useState();
  const [enableBack, setEnableBack] = useState(false);
  const [pathName, setPathName] = useState();
  const history = useHistory();
  // history.listen((location) => {
  //   setPathName(location.pathname);
  //   switch (location.pathname) {
  //     case "/":
  //       setNavItems([...mainRoutes]);
  //       setEnableBack(false);
  //       break;
  //     case "/contract":
  //       setNavItems([...contractRoutes]);
  //       setEnableBack(true);
  //       break;
  //     case "/second":
  //       setNavItems([...mainRoutes]);
  //       setEnableBack(false);
  //       break;
  //   }
  // });
  const handleNav = (path)=>{
    console.log(path)
    if(path==="Contract"){
      setNavItems(contractRoutes.filter(route=>route.display===true))
      // setEnableBack(true);
    }
    if(path==="HomePage")
      setNavItems([...mainRoutes])
  }
  useEffect(() => {
    setNavItems(mainRoutes);
  }, []);
  return (
    <nav className="d-flex" id="navbar">
      {enableBack && (<Link to="/" className="text-white mx-2">back</Link>)}
      {navItems &&
        navItems.map((item, index) => (
          <div key={Math.random() * 1000} className="mx-1">
            {item.type==="directory" && index === 0 &&
            <Link style={{color:'white'}} to='/'
              className={`${index===0 && item.title!=="HomePage"  && "trapezoid py-1  "} mx-1`}
              // className={pathName === item.path ? "selected-nav-item directory px-2" : "directory px-2"}
              onClick={()=>handleNav(item.title)}>{item.title!=="HomePage" && <img src={play} style={{transform:"rotate(180deg)"}} />}{" "}{item.title}</Link>
            }
            {item.type==="directory" && index !== 0 &&
            <a style={{color:'white'}} 
              className="mx-1"
              // className={pathName === item.path ? "selected-nav-item directory px-2" : "directory px-2"}
              onClick={()=>handleNav(item.title)}>{item.title}{item.title!=="HomePage" && <span>{" "}<img src={play} /></span>}</a>
            }
            {item.type==="link" &&
            <Link style={{color:'white'}}
              to={item.path}
              className={pathName === item.path ? "selected-nav-item link px-2" : "link px-2"}
              onClick={()=>handleNav(item.title)}>{item.title}</Link>
            }
          </div>
        ))}
    </nav>
  );
};

export default Navbar;
