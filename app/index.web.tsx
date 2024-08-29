// ./app/index.web.tsx
import useAuthRedirect from "../hooks/useAuthRedirect";
import "../styles/css/index.css";
import { useGlobalStyles } from "../styles/stylesheets/globalStyles";

const Home = () => {
  const authRedirect = useAuthRedirect();
  const { themeTextColor } = useGlobalStyles();

  if (authRedirect) {
    return authRedirect;
  }

  return (
    <div className="home-wrapper">
      <div className="contents-container">
        <p className="textBlack" style={{ color: themeTextColor }}>
          Home Screen (web)
        </p>
      </div>
    </div>
  );
};

export default Home;
