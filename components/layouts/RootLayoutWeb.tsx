// ./components/layouts/RootLayoutWeb.tsx
import { useState } from "react";
import { Slot } from "expo-router";

import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useGlobalStyles } from "../../styles/stylesheets/globalStyles";
import "../../styles/css/globals.css";
import "../../styles/css/root-layout-web.css";
import DrawerMenu from "../navigation/DrawerMenu";
import NavBar from "../navigation/NavBar";

const RootLayoutWeb = () => {
  const { themeBackgroundColor } = useGlobalStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const authRedirect = useAuthRedirect();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <>
      <DrawerMenu
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      {isDrawerOpen ? (
        <div
          className="overlay"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        ></div>
      ) : null}
      <NavBar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <div style={{ backgroundColor: themeBackgroundColor }}>
        <Slot />
      </div>
    </>
  );
};

export default RootLayoutWeb;
