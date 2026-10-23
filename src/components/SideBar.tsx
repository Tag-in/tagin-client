import { NavLink } from "react-router";
import styles from "../styles/components/SideBar.module.css";

const MENUS = [
  { path: "/", label: "홈", icon: "home" },
  { path: "/files", label: "내 파일", icon: "folder" },
  { path: "/recent", label: "최근", icon: "clock" },
  { path: "/important", label: "중요", icon: "star" },
  { path: "/trash", label: "휴지통", icon: "trash" },
];

const USED_GB = 3.2;
const TOTAL_GB = 15;

interface SideBarProps {
  onUpload: () => void;
}

export const SideBar = ({ onUpload }: SideBarProps) => {
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
