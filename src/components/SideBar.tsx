import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { getStorage, type StorageUsage } from "../api/drive";
import { useDriveChanged } from "../lib/driveEvents";
import styles from "../styles/components/SideBar.module.css";
import { formatBytes } from "../utils/format";

const MENUS = [
  { path: "/", label: "홈", icon: "home" },
  { path: "/files", label: "내 파일", icon: "folder" },
  { path: "/recent", label: "최근", icon: "clock" },
  { path: "/important", label: "중요", icon: "star" },
  { path: "/trash", label: "휴지통", icon: "trash" },
];

interface SideBarProps {
  onUpload: () => void;
}

export const SideBar = ({ onUpload }: SideBarProps) => {
  const [storage, setStorage] = useState<StorageUsage | null>(null);
  const [version, setVersion] = useState(0);
  // 업로드·삭제·영구 삭제 뒤 사용량을 다시 읽는다.
  useDriveChanged(() => setVersion((v) => v + 1));

  useEffect(() => {
    let ignore = false;
    getStorage()
      .then((usage) => !ignore && setStorage(usage))
      .catch(() => !ignore && setStorage(null));
    return () => {
      ignore = true;
    };
  }, [version]);

  const percent = storage
    ? Math.min(100, (storage.usedBytes / storage.limitBytes) * 100)
    : 0;

  return (
    <aside className={styles.container}>
      <h1 className={styles.logoWrap}>
        <img src="/assets/icon/TAG-IN.svg" alt="TAG-IN" className={styles.logo} />
      </h1>
      <nav className={styles.menuList}>
        {MENUS.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `${styles.menu} ${isActive ? styles.active : ""}`
            }
          >
            <span
              className={styles.icon}
              style={{ maskImage: `url(/assets/icon/${icon}.svg)` }}
            />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        className={styles.createButton}
        onClick={onUpload}
      >
        + 새로 만들기 / 업로드
      </button>
      <div
        className={styles.storage}
        title={
          storage && storage.trashBytes > 0
            ? `휴지통 ${formatBytes(storage.trashBytes)} 포함`
            : undefined
        }
      >
        <div className={styles.storageBar}>
          <div className={styles.storageFill} style={{ width: `${percent}%` }} />
        </div>
        <span className={styles.storageText}>
          {storage
            ? `저장공간 ${formatBytes(storage.usedBytes)} / ${formatBytes(storage.limitBytes)} 사용`
            : "저장공간 정보를 불러오는 중..."}
        </span>
      </div>
    </aside>
  );
};
