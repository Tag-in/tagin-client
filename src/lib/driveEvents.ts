import { useEffect, useRef } from "react";

// 업로드 창처럼 화면 밖에서 드라이브가 바뀌었을 때 열려 있는 화면이 다시 불러오도록 알린다.
const EVENT = "drive:changed";

export const notifyDriveChanged = () => window.dispatchEvent(new Event(EVENT));

export const useDriveChanged = (onChange: () => void) => {
  const latest = useRef(onChange);
  useEffect(() => {
    latest.current = onChange;
  });

  useEffect(() => {
    const handler = () => latest.current();
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);
};
