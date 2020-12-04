import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import Routes from "./Routes";
import CustomModal from "../components/CustomModal";

declare global {
  interface Window {
    Modal: any;
  }
}

export default function MainPage() {
  console.log(
    "Please dont try to hack. Contact to collaborate with me. FB: https://www.facebook.com/profile.php?id=100010765894081"
  );
  console.log(
    "Please dont try to hack. Contact to collaborate with me. FB: https://www.facebook.com/profile.php?id=100010765894081"
  );
  console.log(
    "Please dont try to hack. Contact to collaborate with me. FB: https://www.facebook.com/profile.php?id=100010765894081"
  );
  console.log(
    "Please dont try to hack. Contact to collaborate with me. FB: https://www.facebook.com/profile.php?id=100010765894081"
  );
  console.log(
    "Please dont try to hack. Contact to collaborate with me. FB: https://www.facebook.com/profile.php?id=100010765894081"
  );
  console.log(
    "Please dont try to hack. Contact to collaborate with me. FB: https://www.facebook.com/profile.php?id=100010765894081"
  );
  return (
    <BrowserRouter>
      <CustomModal
        ref={(ref) => {
          window.Modal = ref;
        }}
      />
      <MainLayout>
        <Routes />
      </MainLayout>
    </BrowserRouter>
  );
}
