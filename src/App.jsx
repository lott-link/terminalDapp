import React, { createContext, useState } from 'react'; 
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import mainRoutes from "./Routes/mainRoutes";
import MyNavbar from "./Components/Navbar";
import useWidth from './Hooks/useWidth';
import { useWeb3React } from "@web3-react/core";
import "./app.styles.css";
import { useEagerConnect, useInactiveListener } from './Hooks/hooks'
import { addresses, chains, converChainIDToName } from './addresses';
import Sidebar from './Components/Sidebar';
export const context = createContext()
function App() {
  const { connector } = useWeb3React()
  const [network,setNetwork] = useState('')
  const [supportedChains,setSupportedChains] = useState([])
  const [pageSupported,setPageSupported] = useState('')
  const width = useWidth()

   // handle logic to recognize the connector currently being activated
   const [activatingConnector, setActivatingConnector] = React.useState()
   React.useEffect(() => {
     if (activatingConnector && activatingConnector === connector) {
       setActivatingConnector(undefined)
     }
   }, [activatingConnector, connector])
 
   // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
   const triedEager = useEagerConnect()
 
   // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
   useInactiveListener(!triedEager || !!activatingConnector)
  return (
    <context.Provider value={{addresses,network,setNetwork,supportedChains,
      setSupportedChains,chains,converChainIDToName,pageSupported,setPageSupported}}>
    <div style={{ position: "relative",minHeight:'100%' }}>
      <h3 className="px-3 m-0" id="title">
        DAPP
      </h3>
      <div className="" id="app-container" style={{ minHeight: "calc(100vh - 3.75rem)" }} >
        <div className='w-100' style={{minHeight:"calc(100vh - 3.75rem)"}}>
          <Router>
            <MyNavbar />
            <main className="d-flex justify-content-center w-100" style={{ minHeight: "calc(100% - 3.75rem)" }}>
              <div
                style={{ backgroundColor: "white",width:'100%',minHeight: "calc(100% - 3.75rem)" }}
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
                <div style={{display:'none'}}><Sidebar/></div>
              </div>
            </main>
          </Router>
        </div>
      </div>
      <h6 className="position-absolute px-3 m-0" 
      style={{bottom:'-8px',right:'4rem',backgroundColor:"white"}}>V.0.2.4</h6>
    </div>
    </context.Provider>
  );
}

export default App;
