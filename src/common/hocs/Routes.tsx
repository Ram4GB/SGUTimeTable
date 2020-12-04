import React from "react";
import { Route, Switch } from "react-router-dom";
import AboutMe from "../../pages/AboutMe";
import HiAdminPage from "../../pages/HiAdminPage";
import NotFoundPage from "../../pages/NotFoundPage";
import TourPage from "../../pages/TourPage";

export default function Routes() {
  const user = { role: "admin" };

  if (user.role === "admin") {
    return (
      <Switch>
        <Route component={HiAdminPage} path="/" exact />
        <Route component={AboutMe} path="/about" exact />
        <Route component={TourPage} path="/tours" exact />
        <Route component={NotFoundPage} path="*" exact />
      </Switch>
    );
  }

  return null;
}
