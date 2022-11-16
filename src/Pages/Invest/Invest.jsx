import { Route } from "react-router-dom";

import investRoutes from "../../Routes/investRoutes";

const Invest = () => {
  return (
    <div className="w-100 h-100">
      {investRoutes.map((route, index) => {
        if (route.render)
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              render={(props) => <route.component {...props} />}
            />
          );
      })}
    </div>
  );
};

export default Invest;
