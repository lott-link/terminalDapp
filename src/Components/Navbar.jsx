import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import mainRoutes from "../Routes/mainRoutes";
import contractRoutes from "../Routes/contractRoutes";
import nftRoutes  from '../Routes/nftRoutes.js'
import useWidth from "../Hooks/useWidth";
import MobileSidebar from "./MobileSidebar";
import play from '../Assetes/play.svg'
import menu from '../Assetes/menu.svg'
const Navbar = () => {
  //sidebar
  const width = useWidth()
  const [show,setShow] = useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
    }
  });
  const handleNav = (path)=>{
    console.log("path",path)
    if(path==="Contract"){
      setNavItems(contractRoutes.filter(route=>route.display===true))
    }
    if(path==="HomePage")
      setNavItems([...mainRoutes])
    if(path==="NFT")
      setNavItems([...nftRoutes])

  }
  useEffect(() => {
    setNavItems(mainRoutes);
  }, []);
  return (
    <nav className="d-flex" id="navbar">
      {width < 500 && <div onClick={()=>setShow(!show)} className="text-white d-flex align-items-center"><img style={{background:"white"}} src={menu}/></div>}
      {show && <div style={{background:'white'}}>sidebar</div>}
      {navItems &&
        navItems.map((item, index) => (
          <div key={Math.random() * 1000} className="mx-1 d-flex align-items-center">
            {item.type==="directory" && index === 0 &&
            <Link style={{color:'white'}} to='/'
              className={`${index===0 && item.title!=="HomePage"  && "trapezoid py-1  "} mx-1`}
              onClick={()=>handleNav("HomePage")}>{item.title!=="HomePage" && <img src={play} style={{transform:"rotate(180deg)"}} />}{" "}{item.title}</Link>
            }
            {item.type==="directory" && index !== 0 &&
            <a style={{color:'white'}} 
              className="mx-1"
              onClick={()=>handleNav(item.title)}>{item.title}{item.title!=="HomePage" && <span >{" "}<img className='mb-1' src={play} /></span>}</a>
            }
            {item.type==="link" &&
            <Link style={{color:'white'}}
              to={item.path}
              className={pathName === item.path ? "selected-nav-item link px-2" : "link px-2"}
              onClick={()=>handleNav(item.title)}>{item.title}</Link>
            }
          </div>
        ))}
        <MobileSidebar show={show} handleClose={handleClose}/>
    </nav>
  );
};

export default Navbar;
