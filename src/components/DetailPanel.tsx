import { useState } from "react";
import type { FileItem } from "../types/file";
import styles from "../styles/components/DetailPanel.module.css";

const TABS = ["세부정보", "활동"];
const SHARED_COUNT = 3;

interface DetailPanelProps {
  file: FileItem;
  location: string;
  onClose: () => void;
}

export const DetailPanel = ({ file, location, onClose }: DetailPanelProps) => {
  const [tab, setTab] = useState(TABS[0]);

  const infos = [
    { label: "유형", value: file.type },
    { label: "크기", value: file.size },
    { label: "위치", value: location },
    { label: "소유자", value: file.owner },
    { label: "수정한 날짜", value: file.date },
  ];

  return (
    <aside className={styles.container}>
      <div className={styles.header}>
        <p className={styles.name}>{file.name}</p>
        <button
          type="button"
          className={styles.close}
          aria-label="닫기"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className={styles.tabs}>
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            className={`${styles.tab} ${tab === name ? styles.tabActive : ""}`}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className={styles.preview}>
        <span className={styles.previewText}>미리보기</span>
      </div>
      <div className={styles.infoList}>
        {infos.map(({ label, value }) => (
          <div key={label} className={styles.info}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
          </div>
        ))}
      </div>
      <div className={styles.share}>
        <span className={styles.label}>공유 대상</span>
        <div className={styles.shareRow}>
          {Array.from({ length: SHARED_COUNT }, (_, i) => (
            <img
              key={i}
              src="/assets/image/ellipse.svg"
              alt=""
              className={styles.avatar}
            />
          ))}
          <div className={styles.spacer} />
          <button type="button" className={styles.shareButton}>
            공유
          </button>
        </div>
      </div>
    </aside>
  );
};
