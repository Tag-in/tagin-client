import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  deleteEntries,
  getRecent,
  starEntries,
  unstarEntries,
  type DriveItemWithFolder,
} from "../api/drive";
import { EntryTable, type EntryRow } from "../components/EntryTable";
import { MainColumn } from "../components/MainColumn";
import { downloadSelection } from "../lib/download";
import { notifyDriveChanged, useDriveChanged } from "../lib/driveEvents";
import styles from "../styles/pages/MyFiles.module.css";
import { formatBytes, formatDate } from "../utils/format";

const LIMIT = 50;

const toRow = (item: DriveItemWithFolder): EntryRow => ({
  key: `ITEM:${item.id}`,
  type: "ITEM",
  id: item.id,
  name: item.name,
  kind: item.kind,
  sub: item.folderName,
  date: formatDate(item.createdAt),
  size: formatBytes(item.sizeBytes),
  starred: item.starredAt !== null,
});

const errorText = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

// 최근에 추가한 파일·링크
const Recent = () => {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);
  useDriveChanged(reload);

  const [data, setData] = useState<{
    version: number;
    items?: DriveItemWithFolder[];
    error?: string;
  }>({ version: -1 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    getRecent(LIMIT)
      .then((items) => !ignore && setData({ version, items }))
      .catch(
        (e) =>
          !ignore &&
          setData({ version, error: errorText(e, "최근 파일을 불러오지 못했습니다.") }),
      );
    return () => {
      ignore = true;
    };
  }, [version]);

  const items = data.version === version ? data.items : undefined;
  const rows = items?.map(toRow);
  const selectedItems = items?.filter((i) => selected.has(`ITEM:${i.id}`)) ?? [];
  const allStarred =
    selectedItems.length > 0 && selectedItems.every((i) => i.starredAt !== null);

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const runAction = async (action: () => Promise<string | void>) => {
    if (selectedItems.length === 0) {
      setStatus("먼저 항목을 선택하세요.");
      return;
    }
    setIsBusy(true);
    setStatus("");
    try {
      const message = await action();
      if (message) setStatus(message);
    } catch (e) {
      setStatus(errorText(e, "요청에 실패했습니다."));
    } finally {
      setIsBusy(false);
    }
  };

  const selection = () => ({ itemIds: selectedItems.map((i) => i.id) });

  const handleDownload = () =>
    runAction(() => downloadSelection(selection(), selectedItems));

  const handleStar = () =>
    runAction(async () => {
      const result = allStarred
        ? await unstarEntries(selection())
        : await starEntries(selection());
      reload();
      return `${result.itemCount}개를 중요 ${allStarred ? "해제" : "표시"}했습니다.`;
    });

  const handleDelete = () =>
    runAction(async () => {
      await deleteEntries(selection());
      setSelected(new Set());
      notifyDriveChanged();
      return `${selectedItems.length}개를 휴지통으로 보냈습니다.`;
    });

  return (
    <MainColumn>
      <div className={styles.content}>
        <div className={styles.titleWrap}>
          <p className={styles.title}>최근</p>
        </div>
        <div className={styles.toolBar}>
          <button type="button" className={styles.button} disabled={isBusy} onClick={handleDownload}>
            다운로드
          </button>
          <button type="button" className={styles.button} disabled={isBusy} onClick={handleStar}>
            {allStarred ? "중요 해제" : "중요 표시"}
          </button>
          <button type="button" className={styles.button} disabled={isBusy} onClick={handleDelete}>
            삭제
          </button>
          <span className={styles.selectedCount}>{selectedItems.length}개 선택됨</span>
          {status && <span className={styles.status}>{status}</span>}
        </div>
        <EntryTable
          rows={rows}
          error={data.version === version ? data.error : undefined}
          emptyText="아직 파일이 없습니다. 업로드하면 내용에 맞는 폴더로 정리됩니다."
          subLabel="폴더"
          dateLabel="추가한 날짜"
          selectedKeys={selected}
          onToggle={toggle}
          onOpen={(row) => {
            const item = items?.find((i) => i.id === row.id);
            if (item) navigate(`/files?folder=${item.folderId}`);
          }}
        />
      </div>
    </MainColumn>
  );
};

export default Recent;
