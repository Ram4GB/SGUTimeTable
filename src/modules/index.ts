import { combineReducers } from "@reduxjs/toolkit";
import reducer from "../modules/app/reducers";
import { IApp } from "../modules/app/reducers";

export interface IRootState {
  app: IApp;
}

export default combineReducers({
  app: reducer,
});
