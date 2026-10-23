import { useState } from "react";
import styles from "../styles/components/UploadDialog.module.css";

interface UploadDialogProps {
  onClose: () => void;
}

export const UploadDialog = ({ onClose }: UploadDialogProps) => {
  const [link, setLink] = useState("");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="파일 업로드"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <p className={styles.title}>파일 업로드</p>
          <button
            type="button"
            className={styles.close}
            aria-label="닫기"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className={styles.dropZone}>
          <p className={styles.dropText}>파일을 여기로 끌어다 놓으세요</p>
          <p className={styles.or}>또는</p>
          <button type="button" className={styles.outlineButton}>
            파일 선택
          </button>
        </div>
        <div className={styles.linkInput}>
          <div className={styles.badge}>
            <img src="/assets/icon/link.svg" alt="" className={styles.badgeIcon} />
          </div>
          <input
            className={styles.input}
            placeholder="링크를 붙여넣어 업로드하세요"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button type="button" className={styles.addButton}>
            추가
          </button>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.outlineButton} onClick={onClose}>
            취소
          </button>
          <button type="button" className={styles.doneButton} onClick={onClose}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};
