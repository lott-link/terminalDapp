import { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import mainRoutes from './Routes/mainRoutes';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import './app.styles.css'
function App() {
  const [navItems,setNavItems] = useState()
  return (
    <div className="h-100" style={{position:'relative'}}>
      <h3 className="text-white px-3" id="title">Lott.Link</h3>
    <div className="h-100" id="app-container">
      <div className="h-100">
      <Router>
        <Navbar/>
        <main className="d-flex" style={{height:'calc(100% - 3rem)'}}>
          <div className="w-25 h-100 text-white" id="sidebar"><Sidebar/></div>
          <div className="w-75 h-100 text-white" style={{backgroundColor:'#020227'}}>
              <Switch>
                {mainRoutes.map((route,index)=>{
                  return <Route
                   key={index}
                   path={route.path} 
                   exact={route.exact}
                   render={props=> <route.component {...props}/>} />
                })}
              </Switch>
          </div>
        </main>
        </Router>
      </div>
    </div>
    </div>
  );
}

export default App;
