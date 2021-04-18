import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import AppUI from "./ui";

import "./index.scss";

ReactDOM.render(<AppUI />, document.getElementById("devnote"));

export default hot(module)(AppUI);
