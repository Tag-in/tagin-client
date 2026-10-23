import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  deleteEntries,
  getStarred,
  unstarEntries,
  type StarredList,
} from "../api/drive";
import { EntryTable, type EntryRow } from "../components/EntryTable";
import { MainColumn } from "../components/MainColumn";
import { downloadSelection } from "../lib/download";
import { notifyDriveChanged, useDriveChanged } from "../lib/driveEvents";
import styles from "../styles/pages/MyFiles.module.css";
import { formatBytes, formatDate } from "../utils/format";

const toRows = ({ folders, items }: StarredList): EntryRow[] => [
  ...folders.map(
    (folder): EntryRow => ({
      key: `FOLDER:${folder.id}`,
      type: "FOLDER",
      id: folder.id,
      name: folder.name,
      kind: null,
      sub: `파일 ${folder.itemCount}개`,
      date: formatDate(folder.starredAt ?? folder.updatedAt),
      size: "—",
      starred: true,
    }),
  ),
  ...items.map(
    (item): EntryRow => ({
      key: `ITEM:${item.id}`,
      type: "ITEM",
      id: item.id,
      name: item.name,
      kind: item.kind,
      sub: item.folderName,
      date: formatDate(item.starredAt ?? item.createdAt),
      size: formatBytes(item.sizeBytes),
      starred: true,
    }),
  ),
];

const errorText = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

// 중요 표시한 폴더와 파일·링크
const Important = () => {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);
  useDriveChanged(reload);

  const [data, setData] = useState<{
    version: number;
    starred?: StarredList;
    error?: string;
  }>({ version: -1 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    getStarred()
      .then((starred) => !ignore && setData({ version, starred }))
      .catch(
        (e) =>
          !ignore &&
          setData({ version, error: errorText(e, "중요 항목을 불러오지 못했습니다.") }),
      );
    return () => {
      ignore = true;
    };
  }, [version]);

  const starred = data.version === version ? data.starred : undefined;
  const rows = starred && toRows(starred);
  const selectedRows = rows?.filter((row) => selected.has(row.key)) ?? [];

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const selection = () => ({
    itemIds: selectedRows.filter((r) => r.type === "ITEM").map((r) => r.id),
    folderIds: selectedRows.filter((r) => r.type === "FOLDER").map((r) => r.id),
  });

  const runAction = async (action: () => Promise<string | void>) => {
    if (selectedRows.length === 0) {
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

  const handleDownload = () =>
    runAction(() => downloadSelection(selection(), starred?.items ?? []));

  const handleUnstar = () =>
    runAction(async () => {
      const result = await unstarEntries(selection());
      setSelected(new Set());
      reload();
      return `${result.itemCount + result.folderCount}개의 중요 표시를 해제했습니다.`;
    });

  const handleDelete = () =>
    runAction(async () => {
      await deleteEntries(selection());
      setSelected(new Set());
      notifyDriveChanged();
      return `${selectedRows.length}개를 휴지통으로 보냈습니다.`;
    });

  return (
    <MainColumn>
      <div className={styles.content}>
        <div className={styles.titleWrap}>
          <p className={styles.title}>중요</p>
        </div>
        <div className={styles.toolBar}>
          <button type="button" className={styles.button} disabled={isBusy} onClick={handleDownload}>
            다운로드
          </button>
          <button type="button" className={styles.button} disabled={isBusy} onClick={handleUnstar}>
            중요 해제
          </button>
          <button type="button" className={styles.button} disabled={isBusy} onClick={handleDelete}>
            삭제
          </button>
          <span className={styles.selectedCount}>{selectedRows.length}개 선택됨</span>
          {status && <span className={styles.status}>{status}</span>}
        </div>
        <EntryTable
          rows={rows}
          error={data.version === version ? data.error : undefined}
          emptyText="중요 표시한 항목이 없습니다. 내 파일에서 항목을 선택하고 '중요 표시'를 누르세요."
          subLabel="위치"
          dateLabel="표시한 날짜"
          selectedKeys={selected}
          onToggle={toggle}
          onOpen={(row) => {
            if (row.type === "FOLDER") navigate(`/files?folder=${row.id}`);
            const item = starred?.items.find((i) => i.id === row.id);
            if (item) navigate(`/files?folder=${item.folderId}`);
          }}
        />
      </div>
    </MainColumn>
  );
};

export default Important;
