// 응답 필드(status, accessToken, refreshToken)는 Swagger에 성공 응답 스키마가 없어
// 설명(status=SIGNUP_REQUIRED, "Refresh Token")을 기준으로 정한 것입니다.
export interface AuthResponse {
  status?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface GoogleSignupBody {
  idToken: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed?: boolean;
}

export const SIGNUP_REQUIRED = "SIGNUP_REQUIRED";

const post = async (path: string, body: unknown): Promise<AuthResponse> => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = Array.isArray(data.message) ? data.message.join(", ") : data.message;
    throw new Error(message ?? `요청에 실패했습니다. (${response.status})`);
  }

  return data;
};

// 가입된 계정이면 토큰을, 미가입이면 status=SIGNUP_REQUIRED를 돌려줍니다.
export const loginWithGoogle = (idToken: string) =>
  post("/api/auth/google", { idToken });

export const signupWithGoogle = (body: GoogleSignupBody) =>
  post("/api/auth/google/signup", body);

// Refresh Token은 1회용이라 재발급 응답의 새 토큰으로 교체해야 합니다.
export const refreshTokens = (refreshToken: string) =>
  post("/api/auth/refresh", { refreshToken });

export const logout = (refreshToken: string) =>
  post("/api/auth/logout", { refreshToken });
