import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import rootReducer from "./modules/index";
import { configureStore } from "@reduxjs/toolkit";
import Root from "./common/hocs/Root";
import "./common/assets/less/index.less";

const store = configureStore({
  reducer: rootReducer,
});

ReactDOM.render(<Root store={store} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
