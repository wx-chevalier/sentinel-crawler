import React from "react";

import DeclarativeCrawlerUI from "./container/DeclarativeCrawlerUI";
import { clientRender } from "../dev-config/tool/render";

clientRender(
  <DeclarativeCrawlerUI/>,
  document.getElementById("root"),
  "./App"
);
