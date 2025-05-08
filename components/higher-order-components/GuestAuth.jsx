import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

const GuestAuth = (WrappedComponent) => {
  return function GuestAuth() {
    const user = useSelector((state) => state.auth.user) ?? null;

    if (user) {
      return <Redirect href="/" />;
    } else {
      return <WrappedComponent />;
    }
  };
};

export default GuestAuth;
