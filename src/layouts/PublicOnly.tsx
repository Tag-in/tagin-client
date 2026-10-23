import { Navigate, Outlet } from "react-router";
import { getAccessToken } from "../lib/tokenStorage";

// 이미 토큰이 있으면 로그인/가입 화면 대신 홈으로 보낸다.
const PublicOnly = () => {
  if (getAccessToken()) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default PublicOnly;
