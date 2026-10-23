const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export const GOOGLE_CALLBACK_PATH = "/auth/google/callback";
export const GOOGLE_TOKEN_MESSAGE = "google-id-token";

// 팝업으로 Google 로그인을 진행하고 ID 토큰(JWT)을 받아온다.
export const getGoogleIdToken = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      reject(new Error("VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다."));
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: `${window.location.origin}${GOOGLE_CALLBACK_PATH}`,
      response_type: "id_token",
      scope: "openid email profile",
      nonce: crypto.randomUUID(),
      prompt: "select_account",
    });

    const popup = window.open(
      `${GOOGLE_AUTH_URL}?${params}`,
      "google-login",
      "width=500,height=640",
    );
    if (!popup) {
      reject(new Error("팝업이 차단되었습니다."));
      return;
    }

    const cleanup = () => {
      window.removeEventListener("message", handleMessage);
      window.clearInterval(timer);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== GOOGLE_TOKEN_MESSAGE) return;
      cleanup();
      if (event.data.idToken) resolve(event.data.idToken);
      else reject(new Error(event.data.error ?? "Google 로그인에 실패했습니다."));
    };

    const timer = window.setInterval(() => {
      if (!popup.closed) return;
      cleanup();
      reject(new Error("로그인 창이 닫혔습니다."));
    }, 500);

    window.addEventListener("message", handleMessage);
  });
