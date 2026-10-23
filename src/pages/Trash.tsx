import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getTrash, restoreEntries, type TrashList } from "../api/drive";
import { MainColumn } from "../components/MainColumn";
import { useDriveChanged } from "../lib/driveEvents";
import styles from "../styles/pages/Trash.module.css";
import { formatBytes, formatDate } from "../utils/format";

const keyOf = (entry: { type: string; id: string }) => `${entry.type}:${entry.id}`;

const Trash = () => {
  // 헤더 검색창에서 넘어온 이름 필터 (휴지통은 의미 검색 대상이 아니다)
  const q = (useSearchParams()[0].get("q") ?? "").trim().toLowerCase();

  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);
  useDriveChanged(reload);

  const [trash, setTrash] = useState<{
    version: number;
    data?: TrashList;
    error?: string;
  }>({ version: -1 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    getTrash()
      .then((data) => !ignore && setTrash({ version, data }))
      .catch(
        (e) =>
          !ignore &&
          setTrash({
            version,
            error:
              e instanceof Error ? e.message : "휴지통을 불러오지 못했습니다.",
          }),
      );
    return () => {
      ignore = true;
    };
  }, [version]);

  const isLoading = trash.version !== version;
  const entries = trash.data?.entries.filter(
    (entry) => !q || entry.name.toLowerCase().includes(q),
  );
  const selectedEntries =
    entries?.filter((entry) => selected.has(keyOf(entry))) ?? [];

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleRestore = async () => {
    if (selectedEntries.length === 0) {
      setStatus("먼저 항목을 선택하세요.");
      return;
    }
    setIsBusy(true);
    setStatus("");
    try {
      const results = await restoreEntries({
        itemIds: selectedEntries.filter((e) => e.type === "ITEM").map((e) => e.id),
        folderIds: selectedEntries
          .filter((e) => e.type === "FOLDER")
          .map((e) => e.id),
      });
      const renamed = results.filter((r) => r.renamedTo);
      setStatus(
        `${results.length}개를 복원했습니다.` +
          (renamed.length
            ? ` 이름이 겹쳐 바꿨습니다: ${renamed.map((r) => r.renamedTo).join(", ")}`
            : ""),
      );
      setSelected(new Set());
      reload();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "복원하지 못했습니다.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <MainColumn>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <p className={styles.title}>휴지통</p>
        </div>
        <div className={styles.notice}>
          <p className={styles.noticeText}>
            휴지통의 항목은 {trash.data?.retentionDays ?? 30}일 후 자동으로 영구
            삭제됩니다.
          </p>
        </div>
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span className={styles.nameCol}>이름</span>
            <span className={styles.locationCol}>자동 삭제일</span>
            <span className={styles.dateCol}>삭제한 날짜</span>
            <span className={styles.sizeCol}>크기</span>
          </div>
          {trash.error && <p className={styles.message}>{trash.error}</p>}
          {!trash.error && isLoading && !trash.data && (
            <p className={styles.message}>불러오는 중...</p>
          )}
          {entries?.length === 0 && (
            <p className={styles.message}>
              {q ? `"${q}"와 일치하는 항목이 없습니다.` : "휴지통이 비어 있습니다."}
            </p>
          )}
          {entries?.map((entry) => {
            const key = keyOf(entry);
            const isSelected = selected.has(key);
            return (
              <div
                key={key}
                className={`${styles.row} ${isSelected ? styles.rowActive : ""}`}
                onClick={() => toggle(key)}
              >
                <div className={styles.nameCol}>
                  <span className={styles.check} />
                  {entry.type === "FOLDER" && (
                    <img
                      src="/assets/icon/folder.svg"
                      alt=""
                      className={styles.rowIcon}
                    />
                  )}
                  <span className={styles.fileName}>{entry.name}</span>
                </div>
                <span className={`${styles.cell} ${styles.locationCol}`}>
                  {formatDate(entry.purgeAt)}
                </span>
                <span className={`${styles.cell} ${styles.dateCol}`}>
                  {formatDate(entry.deletedAt)}
                </span>
                <span className={`${styles.cell} ${styles.sizeCol}`}>
                  {formatBytes(entry.sizeBytes)}
                </span>
              </div>
            );
          })}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            disabled={isBusy}
            onClick={handleRestore}
          >
            복원
          </button>
          <button
            type="button"
            className={styles.button}
            disabled
            title="보관 기간이 지나면 자동으로 영구 삭제됩니다"
          >
            영구 삭제
          </button>
          <span className={styles.selectedCount}>
            {selectedEntries.length}개 선택됨
          </span>
          {status && <span className={styles.status}>{status}</span>}
        </div>
      </div>
    </MainColumn>
  );
};

export default Trash;
