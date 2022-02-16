import React, { createContext, useState } from 'react'; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import mainRoutes from "./Routes/mainRoutes";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import "./app.styles.css";
import { addresses, chains, converChainIDToName } from './addresses';
export const context = createContext()
function App() {
  const [network,setNetwork] = useState('')
  const [supportedChains,setSupportedChains] = useState([])
  const [pageSupported,setPageSupported] = useState('')
  return (
    <context.Provider value={{addresses,network,setNetwork,supportedChains,
      setSupportedChains,chains,converChainIDToName,pageSupported,setPageSupported}}>
    <div className="h-100" style={{ position: "relative" }}>
      <h3 className="text-white px-3 m-0" id="title">
        Lott.Link
      </h3>
      <div className="h-100" id="app-container">
        <div className="h-100">
          <Router>
            <Navbar />
            <main className="d-flex justify-content-center" style={{ height: "calc(100% - 3.75rem)" }}>
              <div className="w-25 h-100 text-white" id="sidebar">
                <Sidebar />
              </div>
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
