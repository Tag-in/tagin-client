import type { DriveEntryType, DriveItemKind } from "../api/drive";
import styles from "../styles/pages/MyFiles.module.css";

// 최근·중요 화면처럼 여러 폴더의 항목을 한 표에 보여줄 때 쓰는 행
export interface EntryRow {
  key: string;
  type: DriveEntryType;
  id: string;
  name: string;
  kind: DriveItemKind | null;
  // 두 번째 열(폴더 이름 등)
  sub: string;
  date: string;
  size: string;
  starred: boolean;
}

interface EntryTableProps {
  rows?: EntryRow[];
  error?: string;
  emptyText: string;
  subLabel: string;
  dateLabel: string;
  selectedKeys: Set<string>;
  onToggle: (key: string) => void;
  // 두 번 클릭
  onOpen?: (row: EntryRow) => void;
}

export const EntryTable = ({
  rows,
  error,
  emptyText,
  subLabel,
  dateLabel,
  selectedKeys,
  onToggle,
  onOpen,
}: EntryTableProps) => (
  <div className={styles.table}>
    <div className={`${styles.row} ${styles.headerRow}`}>
      <span className={styles.nameCol}>이름</span>
      <span className={styles.ownerCol}>{subLabel}</span>
      <span className={styles.dateCol}>{dateLabel}</span>
      <span className={styles.sizeCol}>크기</span>
    </div>
    {error && <p className={styles.message}>{error}</p>}
    {!error && !rows && <p className={styles.message}>불러오는 중...</p>}
    {rows?.length === 0 && <p className={styles.message}>{emptyText}</p>}
    {rows?.map((row) => {
      const isSelected = selectedKeys.has(row.key);
      return (
        <div
          key={row.key}
          className={`${styles.row} ${isSelected ? styles.rowActive : ""}`}
          title={onOpen ? "두 번 클릭해서 폴더 열기" : undefined}
          onClick={() => onToggle(row.key)}
          onDoubleClick={() => onOpen?.(row)}
        >
          <div className={styles.nameCol}>
            <span className={styles.check} />
            {row.type === "FOLDER" && (
              <img src="/assets/icon/folder.svg" alt="" className={styles.rowIcon} />
            )}
            {row.kind === "LINK" && (
              <img src="/assets/icon/link.svg" alt="" className={styles.rowIcon} />
            )}
            <span className={styles.fileName}>{row.name}</span>
            {row.starred && (
              <img
                src="/assets/icon/star.svg"
                alt="중요"
                title="중요"
                className={styles.rowIcon}
              />
            )}
          </div>
          <span className={`${styles.cell} ${styles.ownerCol}`}>{row.sub}</span>
          <span className={`${styles.cell} ${styles.dateCol}`}>{row.date}</span>
          <span className={`${styles.cell} ${styles.sizeCol}`}>{row.size}</span>
        </div>
      );
    })}
  </div>
);
