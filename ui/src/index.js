import React from "react";
import { Provider } from "mobx-react";
import stores from "./stores/Stores";
import App from "./App";
import { clientRender } from "../dev-config/wrapper/render";

clientRender(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById("root"),
  "./App"
);
