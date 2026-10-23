import { useState } from "react";
import styles from "../styles/components/SideBar.module.css";

const MENUS = [
  { id: "home", label: "홈", icon: "home" },
  { id: "files", label: "내 파일", icon: "folder" },
  { id: "recent", label: "최근", icon: "clock" },
  { id: "important", label: "중요", icon: "star" },
  { id: "trash", label: "휴지통", icon: "trash" },
];

const USED_GB = 3.2;
const TOTAL_GB = 15;

export const SideBar = () => {
  const [active, setActive] = useState("files");

  return (
    <aside className={styles.container}>
      <h1 className={styles.logoWrap}>
        <img src="/assets/icon/TAG-IN.svg" alt="TAG-IN" className={styles.logo} />
      </h1>
      <nav className={styles.menuList}>
        {MENUS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.menu} ${active === id ? styles.active : ""}`}
            onClick={() => setActive(id)}
          >
            <span
              className={styles.icon}
              style={{ maskImage: `url(/assets/icon/${icon}.svg)` }}
            />
            {label}
          </button>
        ))}
      </nav>
      <button type="button" className={styles.createButton}>
        + 새로 만들기 / 업로드
      </button>
      <div className={styles.storage}>
        <div className={styles.storageBar}>
          <div
            className={styles.storageFill}
            style={{ width: `${(USED_GB / TOTAL_GB) * 100}%` }}
          />
        </div>
        <span className={styles.storageText}>
          저장공간 {USED_GB}GB / {TOTAL_GB}GB 사용
        </span>
      </div>
    </aside>
  );
};
