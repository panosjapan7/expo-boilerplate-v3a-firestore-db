// ./hooks/useAuthRedirect.ts
import { useContext, useEffect, useState } from "react";
import { router, useSegments } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import LoadingIndicator from "../components/indicators/LoadingIndicator";

const useAuthRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  const [isMounted, setIsMounted] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && isMounted) {
      const isInDrawerOrLowerLevel = segments[0] === "(drawer)";

      // If user is not logged in and is in a protected route, redirect to login
      if (!user && isInDrawerOrLowerLevel) {
        router.replace("/login");
        return;
      }

      // If user is logged in and is not in a protected route, redirect to Feed
      if (user && !isInDrawerOrLowerLevel) {
        router.replace("/(drawer)/(tabs)/feed");
        return;
      }
    }
  }, [loading, isMounted, user, segments]);

  if (loading || !isMounted) {
    return <LoadingIndicator />;
  }

  return null;
};

export default useAuthRedirect;
