import styles from "../styles/components/FileCard.module.css";

interface FileCardProps {
  name: string;
  date: string;
  owner: string;
  checked: boolean;
  onToggle: () => void;
}

export const FileCard = ({
  name,
  date,
  owner,
  checked,
  onToggle,
}: FileCardProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <span className={styles.previewText}>미리보기</span>
      </div>
      <div
        aria-pressed={checked}
        aria-label={`${name} 선택`}
        onClick={onToggle}
        style={{cursor:'pointer'}}
      >
        <div className={styles.nameWrap}>
          <button
            type="button"
            className={`${styles.check} ${checked ? styles.checked : ""}`}
          />
          <span className={styles.name}>{name}</span>
        </div>
        <div className={styles.metaWrap}>
          <span className={styles.meta}>
            {date} · {owner}
          </span>
        </div>
      </div>
    </div>
  );
};
