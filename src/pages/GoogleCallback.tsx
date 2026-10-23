import { useEffect } from "react";
import { GOOGLE_TOKEN_MESSAGE } from "../lib/googleAuth";

// Google 로그인 팝업이 돌아오는 페이지: URL 해시의 id_token을 부모 창에 전달하고 닫는다.
const GoogleCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));

    window.opener?.postMessage(
      {
        type: GOOGLE_TOKEN_MESSAGE,
        idToken: params.get("id_token"),
        error: params.get("error"),
      },
      window.location.origin,
    );
    window.close();
  }, []);

  return null;
};

export default GoogleCallback;
