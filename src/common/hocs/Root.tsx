import React from "react";
import { Provider } from "react-redux";
import MainPage from "./MainPage";

interface IProps {
  store: any;
}

export default function Root(props: IProps) {
  const { store } = props;
  return (
    <Provider store={store}>
      <MainPage></MainPage>
    </Provider>
  );
}
