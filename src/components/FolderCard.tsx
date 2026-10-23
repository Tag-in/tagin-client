import styles from "../styles/components/FolderCard.module.css";

interface FolderCardProps {
  name: string;
  fileCount: number;
  checked: boolean;
  onToggle: () => void;
}

export const FolderCard = ({
  name,
  fileCount,
  checked,
  onToggle,
}: FolderCardProps) => {
  return (
    <div
      className={styles.container}
      aria-pressed={checked}
      aria-label={`${name} 선택`}
      onClick={onToggle}
    >
      <button
        type="button"
        className={`${styles.check} ${checked ? styles.checked : ""}`}
      />
      <div className={styles.info}>
        <span className={styles.textWrap}>{name}</span>
        <span className={styles.note}>파일 {fileCount}개</span>
      </div>
    </div>
  );
};
