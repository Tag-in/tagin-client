import { useRef, useState, type DragEvent } from "react";
import { uploadFile, uploadLink, type UploadResult } from "../api/drive";
import { notifyDriveChanged } from "../lib/driveEvents";
import styles from "../styles/components/UploadDialog.module.css";

interface UploadDialogProps {
  onClose: () => void;
}

interface UploadLog {
  id: number;
  name: string;
  state: "uploading" | "done" | "error";
  message: string;
}

const resultMessage = ({ folder, folderCreated }: UploadResult) =>
  folderCreated
    ? `새 폴더 '${folder.name}'에 저장했습니다.`
    : `'${folder.name}' 폴더에 저장했습니다.`;

export const UploadDialog = ({ onClose }: UploadDialogProps) => {
  const [link, setLink] = useState("");
  const [logs, setLogs] = useState<UploadLog[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const nextLogId = useRef(0);

  const updateLog = (id: number, patch: Partial<UploadLog>) =>
    setLogs((prev) => prev.map((log) => (log.id === id ? { ...log, ...patch } : log)));

  // 서버가 내용을 보고 폴더를 정하므로 폴더를 고르지 않는다.
  const run = async (name: string, upload: () => Promise<UploadResult>) => {
    const id = nextLogId.current++;
    setLogs((prev) => [...prev, { id, name, state: "uploading", message: "업로드 중..." }]);
    try {
      const result = await upload();
      updateLog(id, { name: result.item.name, state: "done", message: resultMessage(result) });
      notifyDriveChanged();
    } catch (e) {
      updateLog(id, {
        state: "error",
        message: e instanceof Error ? e.message : "업로드에 실패했습니다.",
      });
    }
  };

  // 임베딩 API 한도를 고려해 한 번에 하나씩 올린다.
  const uploadFiles = async (files: File[]) => {
    for (const file of files) await run(file.name, () => uploadFile(file));
  };

  const handleAddLink = () => {
    const url = link.trim();
    if (!url) return;
    setLink("");
    if (!/^https?:\/\/[^\s/]+\.[^\s]+$/i.test(url)) {
      setLogs((prev) => [
        ...prev,
        {
          id: nextLogId.current++,
          name: url,
          state: "error",
          message: "http:// 또는 https://로 시작하는 링크를 입력하세요.",
        },
      ]);
      return;
    }
    void run(url, () => uploadLink(url));
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    void uploadFiles([...e.dataTransfer.files]);
  };

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
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <p className={styles.dropText}>파일을 여기로 끌어다 놓으세요</p>
          <p className={styles.or}>또는</p>
          <button
            type="button"
            className={styles.outlineButton}
            onClick={() => fileInput.current?.click()}
          >
            파일 선택
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              const files = [...(e.target.files ?? [])];
              e.target.value = "";
              void uploadFiles(files);
            }}
          />
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAddLink();
            }}
          />
          <button type="button" className={styles.addButton} onClick={handleAddLink}>
            추가
          </button>
        </div>
        {logs.length > 0 && (
          <ul className={styles.logList}>
            {logs.map((log) => (
              <li key={log.id} className={styles.log}>
                <span className={styles.logName}>{log.name}</span>
                <span
                  className={`${styles.logMessage} ${log.state === "error" ? styles.logError : ""}`}
                >
                  {log.message}
                </span>
              </li>
            ))}
          </ul>
        )}
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
