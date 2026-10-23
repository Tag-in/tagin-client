import { useState } from "react";
import { useNavigate } from "react-router";
import { loginWithGoogle, SIGNUP_REQUIRED } from "../api/auth";
import { getGoogleIdToken } from "../lib/googleAuth";
import { saveTokens } from "../lib/tokenStorage";
import styles from "../styles/pages/Login.module.css";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const idToken = await getGoogleIdToken();
      const { status, accessToken, refreshToken } =
        await loginWithGoogle(idToken);

      if (status === SIGNUP_REQUIRED) {
        navigate("/signup", { state: { idToken } });
        return;
      }
      if (!accessToken || !refreshToken) {
        throw new Error("로그인 응답에서 토큰을 찾을 수 없습니다.");
      }
      saveTokens(accessToken, refreshToken);
      navigate("/", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "로그인에 실패했습니다.");
    }
  };

  // TODO: Apple 로그인 API 연동 전 임시로 홈으로 이동
  const handleAppleLogin = () => navigate("/");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <img src="/assets/icon/TAG-IN.svg" alt="TAG-IN" className={styles.logo} />
        </div>
        <div className={styles.heading}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>
            TAG - IN으로 파일을 정리하고 빠르게 찾아보세요.
          </p>
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.google}`}
            onClick={handleGoogleLogin}
          >
            <img src="/assets/icon/google.svg" alt="" className={styles.icon} />
            Google로 계속하기
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.apple}`}
            onClick={handleAppleLogin}
          >
            <img src="/assets/icon/apple.svg" alt="" className={styles.icon} />
            Apple로 계속하기
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <p className={styles.terms}>
          계속하면 서비스 이용약관 및 개인정보 처리방침에
          <br />
          동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
};

export default Login;
