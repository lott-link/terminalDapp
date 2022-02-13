import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import mainRoutes from "../Routes/mainRoutes";
import contractRoutes from "../Routes/contractRoutes";
import nftRoutes  from '../Routes/nftRoutes.js'
import play from '../Assetes/play.svg'
import toolsRoutes from "../Routes/toolsRoutes";
const Navbar = () => {
  //sidebar
  const [navItems, setNavItems] = useState();
  const [pathName, setPathName] = useState();
  const history = useHistory()
  history.listen((location) => {
    setPathName(location.pathname);
    switch (location.pathname) {
      case "/":
        setNavItems([...mainRoutes]);
        break;
      case "/contract":
        setNavItems([...contractRoutes]);
        break;
      case "/nft":
        setNavItems([...nftRoutes]);
        break;
      case "/tools":
        setNavItems([...toolsRoutes]);
        break;
      default:
        break;
    }
  });
  const handleNav = (path)=>{
    if(path==="Contract"){
      setNavItems(contractRoutes.filter(route=>route.display===true))
    }
    if(path==="HomePage")
      setNavItems([...mainRoutes])
    if(path==="NFT")
      setNavItems([...nftRoutes])
    if(path==="tools")
      setNavItems([...toolsRoutes])

  }
  useEffect(() => {
    setNavItems(mainRoutes);
  }, []);
  return (
    <nav className="d-flex" id="navbar">
      {navItems &&
        navItems.map((item, index) => (
          <div key={Math.random() * 1000} className="mx-1 d-flex align-items-center">
            {item.type==="directory" && index === 0 &&
            <Link style={{color:'white',textTransform:"capitalize"}} to='/'
              className={`${index===0 && item.title!=="HomePage"  && "trapezoid py-1  "} mx-1`}
              onClick={()=>handleNav("HomePage")}>{item.title!=="HomePage" && <img src={play} alt="play-icon" style={{transform:"rotate(180deg)"}} />}{" "}{item.title}</Link>
            }
            {item.type==="directory" && index !== 0 &&
            <button style={{border:'none',backgroundColor:"#020227",color:'white',textTransform:"capitalize"}} 
              className="mx-1" 
              onClick={()=>handleNav(item.title)}>{item.title}{item.title!=="HomePage" && <span >{" "}<img className='mb-1' alt="icon" src={play} /></span>}</button>
            }
            {item.type==="link" &&
            <Link 
              to={item.path} style={{textTransform:"capitalize",color:'white'}}
              className={pathName === item.path ? "selected-nav-item link px-2" : "link px-2"}
              onClick={()=>handleNav(item.title)}>{item.title}</Link>
            }
          </div>
        ))}
    </nav>
  );
};

export default Navbar;
