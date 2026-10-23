import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { signupWithGoogle } from "../api/auth";
import { saveTokens } from "../lib/tokenStorage";
import styles from "../styles/pages/Signup.module.css";

const TERMS = [
  { id: "termsAgreed", label: "서비스 이용약관", required: true },
  { id: "privacyAgreed", label: "개인정보 수집 및 이용", required: true },
  { id: "marketingAgreed", label: "마케팅 정보 수신", required: false },
] as const;

type TermId = (typeof TERMS)[number]["id"];

const Signup = () => {
  const navigate = useNavigate();
  const idToken = (useLocation().state as { idToken?: string } | null)?.idToken;

  const [agreed, setAgreed] = useState<Record<TermId, boolean>>({
    termsAgreed: false,
    privacyAgreed: false,
    marketingAgreed: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인을 거치지 않고 들어오면 로그인 화면으로 돌려보낸다.
  if (!idToken) return <Navigate to="/login" replace />;

  const canSubmit = TERMS.every(({ id, required }) => !required || agreed[id]);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    try {
      const { accessToken, refreshToken } = await signupWithGoogle({
        idToken,
        ...agreed,
      });
      if (!accessToken || !refreshToken) {
        throw new Error("가입 응답에서 토큰을 찾을 수 없습니다.");
      }
      saveTokens(accessToken, refreshToken);
      navigate("/", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>약관에 동의해 주세요</h1>
        <p className={styles.subtitle}>
          필수 항목에 동의하면 바로 시작할 수 있어요.
        </p>
        <div className={styles.list}>
          {TERMS.map(({ id, label, required }) => (
            <label key={id} className={styles.item}>
              <input
                type="checkbox"
                checked={agreed[id]}
                onChange={(e) =>
                  setAgreed((prev) => ({ ...prev, [id]: e.target.checked }))
                }
              />
              <span className={styles.badge}>{required ? "필수" : "선택"}</span>
              <span className={styles.label}>{label}</span>
            </label>
          ))}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="button"
          className={styles.submit}
          disabled={!canSubmit || isLoading}
          onClick={handleSubmit}
        >
          동의하고 계속
        </button>
      </div>
    </div>
  );
};

export default Signup;
