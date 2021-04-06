import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import AppUI from "./ui";

import './index.css';

ReactDOM.render(<AppUI />, document.getElementById("editor_area"));

export default hot(module)(AppUI);
