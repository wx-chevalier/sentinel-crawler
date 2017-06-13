import React from "react";
import { Provider } from "mobx-react";
import stores from "./store/stores";
import App from "./App";
import { clientRender } from "../dev-config/tool/render";

clientRender(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById("root"),
  "./App"
);
