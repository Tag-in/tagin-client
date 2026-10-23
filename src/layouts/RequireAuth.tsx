import { Navigate, Outlet } from "react-router";
import { getAccessToken } from "../lib/tokenStorage";

// 토큰이 없으면 로그인 화면으로 보낸다.
const RequireAuth = () => {
  if (!getAccessToken()) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default RequireAuth;
