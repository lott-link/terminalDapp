import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import mainRoutes from "../Routes/mainRoutes";
import contractRoutes from "../Routes/contractRoutes";
import nftRoutes  from '../Routes/nftRoutes.js'
import play from '../Assetes/play.svg'
import toolsRoutes from "../Routes/toolsRoutes";
import { Nav, Container, Navbar } from 'react-bootstrap'
import useWidth from "../Hooks/useWidth";
import Sidebar from "./Sidebar";
import Button from './styled/Button'
const MyNavbar = () => {
  //sidebar
  const [navItems, setNavItems] = useState();
  const [pathName, setPathName] = useState();
  const width = useWidth()
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
    <nav className="d-flex w-100" id="navbar">
      <Navbar className="w-100" expand="lg">
          <Navbar.Toggle className="bg-light" aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {width > 992 &&
            <Nav className="me-auto text-white">
              {navItems &&
              navItems.map((item, index) => (
                <div key={Math.random() * 1000} className="mx-1 d-flex align-items-center">
                  {item.type==="directory" && index === 0 && 
                  <Link style={{color:'white',textTransform:"capitalize"}} to='/'
                    className={`${index===0 && item.title!=="HomePage"  && "trapezoid py-1  "} mx-1`}
                    onClick={()=>handleNav("HomePage")}>{item.title!=="HomePage" && <img src={play} alt="play-icon" style={{width:'11px',height:"14px",transform:"rotate(180deg)"}} />}{" "}{item.title}</Link>
                  }
                  {item.type==="directory" && index !== 0 &&
                  <button style={{border:'none',backgroundColor:"#020227",color:'white',textTransform:"capitalize"}} 
                    className="mx-1" 
                    onClick={()=>handleNav(item.title)}>{item.title}{item.title!=="HomePage" && <span >{" "}<img  style={{width:'11px',height:"14px"}} className='mb-1' alt="icon" src={play} /></span>}</button>
                  }
                  {item.type==="link" &&
                  <Link 
                    to={item.path} style={{textTransform:"capitalize",color:'white'}}
                    className={pathName === item.path ? "selected-nav-item link px-2" : "link px-2"}
                    onClick={()=>handleNav(item.title)}>{item.title}</Link>
                  }
                </div>
              ))}
            </Nav>
            }
            {width < 992 &&
              <Nav className="me-auto">
              {navItems &&
              navItems.map((item, index) => (
                <div key={Math.random() * 1000} className="mx-1 d-flex align-items-start">
                  {item.type==="directory" && index === 0 && 
                  <Button primary style={{textTransform:"capitalize",margin:'8px 0'}} 
                    className={`${index===0 && item.title!=="HomePage"  && "trapezoid py-1  "} `}
                    onClick={()=>{handleNav("HomePage");history.push('/')}}>{item.title!=="HomePage" && <img src={play} alt="play-icon" style={{width:'11px',height:"14px",transform:"rotate(180deg)",filter:'contrast(10%)'}} />}{" "}{item.title}</Button>
                  }
                  {item.type==="directory" && index !== 0 &&
                  <Button primary style={{border:'none',textTransform:"capitalize",margin:'8px 0'}} 
                    className="" 
                    onClick={()=>handleNav(item.title)}>{item.title}{item.title!=="HomePage" && <span >{" "}<img  style={{width:'11px',height:"14px",filter:'contrast(10%)'}} className='mb-1' alt="icon" src={play} /></span>}</Button>
                  }
                  {item.type==="link" &&
                  <Button primary
                    to={item.path} style={{textTransform:"capitalize",margin:'8px 0'}}
                    className={pathName === item.path ? "selected-nav-item link px-2" : "link px-2"}
                    onClick={()=>{handleNav(item.title);history.push(item.path)}}>{item.title}</Button>
                  }
                </div>
              ))}
            </Nav>
            }
          </Navbar.Collapse>
      </Navbar>
    </nav>
  );
};

export default MyNavbar;