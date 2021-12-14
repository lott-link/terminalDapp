import React, { createContext, useState } from 'react'; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import mainRoutes from "./Routes/mainRoutes";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import useWidth from './Hooks/useWidth'
import "./app.styles.css";
export const context = createContext()
const addresses = {
  polygon:{
     factory:"",
     register:"",
     NFT:"0x6517077303340e0E826d6DaCD64813cb6A9E3195"            
  },
  mumbai:{
     factory:"0xe88f4Ba9F8fe1701F3463A6244dcd7d3538a3b3F",
     register:"0x92c3f3b2122b61a50b218df446e2799535fcb519",
     NFT:"0xd2Ad56D684A211b5Ee5a2aFb6e8E7a6e6F642d67"                
  }
}
function App() {
  const width = useWidth()
  const [network,setNetwork] = useState('mumbai')
  return (
    <context.Provider value={{addresses,network,setNetwork}}>
    <div className="h-100" style={{ position: "relative" }}>
      <h3 className="text-white px-3" id="title">
        Lott.Link
      </h3>
      <div className="h-100" id="app-container">
        <div className="h-100">
          <Router>
            <Navbar />
            <main className="d-flex justify-content-center" style={{ height: "calc(100% - 3rem)" }}>
              {width > 500 && <div className="w-25 h-100 text-white" id="sidebar">
                <Sidebar />
              </div>}
              <div
                className="w-75 h-100 text-white"
                style={{ backgroundColor: "#020227" }}
              >
                <Switch>
                  {mainRoutes.map((route, index) => {
                    return (
                      <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        render={(props) => <route.component {...props} />}
                      />
                    );
                  })}
                </Switch>
              </div>
            </main>
          </Router>
        </div>
      </div>
    </div>
    </context.Provider>

  );
}

export default App;
