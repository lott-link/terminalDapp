import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import mainRoutes from "../Routes/mainRoutes";
import contractRoutes from "../Routes/contractRoutes";
import nftRoutes  from '../Routes/nftRoutes.js'
import signinRoutes from "../Routes/signinRoutes";
import play from '../Assetes/play.svg'
import toolsRoutes from "../Routes/toolsRoutes";
import { Nav, Navbar } from 'react-bootstrap'
import useWidth from "../Hooks/useWidth";
import Button from './styled/Button'
import investRoutes from "../Routes/investRoutes";

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
      case '/sign_in':
        setNavItems([...signinRoutes]);
        break;
      case '/invest':
        setNavItems([...investRoutes]);
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
    if(path==="sign_in")
      setNavItems([...signinRoutes])
    if(path === "Invest")
      setNavItems([...investRoutes])
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
                    className={`${index===0 && item.title!=="HomePage"  && "trapezoid py-1  "} mx-1 d-flex align-items-center`}
                    onClick={()=>handleNav("HomePage")}>{item.title!=="HomePage" && <div style={{width:'0px',height:"0px",borderTop:"7.5px solid transparent",borderRight:"15px solid #555",borderBottom:"7.5px solid transparent"}} className="mx-2" ></div>}<div>{" "}{item.title}</div></Link>
                  }
                  {item.type==="directory" && index !== 0 &&
                  <button style={{border:'none',backgroundColor:"#020227",color:'white',textTransform:"capitalize"}} 
                    className="mx-1 d-flex align-items-center" 
                    onClick={()=>handleNav(item.title)}>
                      <div>
                        {item.title}
                      </div>
                      {item.title!=="HomePage" && 
                      <span >{" "}
                      <div style={{width:'0px',height:"0px",borderTop:"7.5px solid transparent",borderLeft:"15px solid #555",borderBottom:"7.5px solid transparent"}} className="mx-2" >
                      </div>
                      </span>}
                  </button>
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
                    className={`${index===0 && item.title!=="HomePage"  && "trapezoid py-1  "} d-flex align-items-center`}
                    onClick={()=>{handleNav("HomePage");history.push('/')}}>{item.title!=="HomePage" && <div style={{width:'0px',height:"0px",borderTop:"7.5px solid transparent",borderRight:"15px solid #555",borderBottom:"7.5px solid transparent"}} className="mx-2" ></div>}{" "}{item.title}</Button>
                  }
                  {item.type==="directory" && index !== 0 &&
                  <Button primary style={{border:'none',textTransform:"capitalize",margin:'8px 0'}} 
                    className="d-flex align-items-center" 
                    onClick={()=>handleNav(item.title)}>{item.title}{item.title!=="HomePage" && <span >{" "}<div style={{width:'0px',height:"0px",borderTop:"7.5px solid transparent",borderLeft:"15px solid #555",borderBottom:"7.5px solid transparent"}} className="mx-2" >
                    </div></span>}</Button>
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
