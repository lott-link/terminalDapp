import React, { createContext, useState } from 'react'; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import mainRoutes from "./Routes/mainRoutes";
import MyNavbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import useWidth from './Hooks/useWidth';
import "./app.styles.css";
import { addresses, chains, converChainIDToName } from './addresses';
export const context = createContext()
function App() {
  const [network,setNetwork] = useState('')
  const [supportedChains,setSupportedChains] = useState([])
  const [pageSupported,setPageSupported] = useState('')
  const width = useWidth()
  return (
    <context.Provider value={{addresses,network,setNetwork,supportedChains,
      setSupportedChains,chains,converChainIDToName,pageSupported,setPageSupported}}>{console.log(width)}
    <div style={{ position: "relative",minHeight:'100%' }}>
      <h3 className="text-white px-3 m-0" id="title">
        Lott.Link
      </h3>
      <div className="" id="app-container" style={{ minHeight: "calc(100vh - 3.75rem)" }} >
        <div style={{minHeight:"calc(100vh - 3.75rem)"}}>
          <Router>
            <MyNavbar />
            <main className="d-flex justify-content-center w-100" style={{ minHeight: "calc(100% - 3.75rem)" }}>
              {width > 992 &&
              <div className="h-100 text-white" id="sidebar" style={{width:'28%'}}>
                <Sidebar />
              </div>
              }
              <div
                className="h-100 text-white"
                style={{ backgroundColor: "#020227",width:width > 992 ? '72%' : '100%' }}
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
