import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  deleteEntries,
  getFolderContents,
  getFolders,
  type DriveFolder,
  type DriveFolderContents,
  type DriveItem,
} from "../api/drive";
import { DetailPanel } from "../components/DetailPanel";
import { FolderTree } from "../components/FolderTree";
import { MainColumn } from "../components/MainColumn";
import { useDriveChanged } from "../lib/driveEvents";
import { downloadSelection } from "../lib/download";
import styles from "../styles/pages/MyFiles.module.css";
import { formatBytes, formatDate, typeLabel } from "../utils/format";
import { buildFolderTree } from "../utils/tree";

// 폴더 트리의 맨 위 "내 파일". 최상위 폴더들을 보여준다.
const ROOT_ID = "root";
const ROOT_NAME = "내 파일";

interface Row {
  key: string;
  type: "FOLDER" | "ITEM";
  id: string;
  name: string;
  date: string;
  size: string;
  item?: DriveItem;
}

const folderRow = (folder: DriveFolder): Row => ({
  key: `FOLDER:${folder.id}`,
  type: "FOLDER",
  id: folder.id,
  name: folder.name,
  date: formatDate(folder.updatedAt),
  size: "—",
});

const itemRow = (item: DriveItem): Row => ({
  key: `ITEM:${item.id}`,
  type: "ITEM",
  id: item.id,
  name: item.name,
  date: formatDate(item.createdAt),
  size: formatBytes(item.sizeBytes),
  item,
});

const errorText = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

const MyFiles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const folderId = searchParams.get("folder") ?? ROOT_ID;

  // 삭제·업로드 후 다시 불러오기 위한 버전
  const [version, setVersion] = useState(0);
  const reload = () => setVersion((v) => v + 1);
  useDriveChanged(reload);

  const [folders, setFolders] = useState<{
    version: number;
    list?: DriveFolder[];
    error?: string;
  }>({ version: -1 });
  const [contents, setContents] = useState<{
    key: string;
    data?: DriveFolderContents;
    error?: string;
  }>({ key: "" });
  // 폴더를 옮기면 선택이 풀리도록 폴더와 함께 저장한다.
  const [selection, setSelection] = useState({
    folderId,
    keys: new Set<string>(),
  });
  const [status, setStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let ignore = false;
    getFolders()
      .then((list) => !ignore && setFolders({ version, list }))
      .catch(
        (e) =>
          !ignore &&
          setFolders({
            version,
            error: errorText(e, "폴더를 불러오지 못했습니다."),
          }),
      );
    return () => {
      ignore = true;
    };
  }, [version]);

  const contentsKey = `${folderId}:${version}`;
  useEffect(() => {
    if (folderId === ROOT_ID) return;
    let ignore = false;
    getFolderContents(folderId)
      .then((data) => !ignore && setContents({ key: contentsKey, data }))
      .catch(
        (e) =>
          !ignore &&
          setContents({
            key: contentsKey,
            error: errorText(e, "폴더 내용을 불러오지 못했습니다."),
          }),
      );
    return () => {
      ignore = true;
    };
  }, [folderId, contentsKey]);

  const isRoot = folderId === ROOT_ID;
  const current = contents.key === contentsKey ? contents : undefined;
  const rootFolders = folders.list?.filter((f) => f.parentId === null);

  const rows: Row[] | undefined = isRoot
    ? rootFolders?.map(folderRow)
    : current?.data && [
        ...current.data.folders.map(folderRow),
        ...current.data.items.map(itemRow),
      ];
  const loadError = isRoot ? folders.error : current?.error;

  const path = isRoot ? [] : (current?.data?.path ?? []);
  const pathNames = [ROOT_NAME, ...path.map((p) => p.name)];

  const selectedKeys =
    selection.folderId === folderId ? selection.keys : new Set<string>();
  const selectedRows = rows?.filter((row) => selectedKeys.has(row.key)) ?? [];
  const selectedFile =
    selectedRows.length === 1 ? selectedRows[0].item : undefined;

  const openFolder = (id: string) => {
    setStatus("");
    setSearchParams(id === ROOT_ID ? {} : { folder: id });
  };

  const toggleRow = (key: string) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelection({ folderId, keys: next });
  };

  const toSelection = () => ({
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
    runAction(() =>
      downloadSelection(
        toSelection(),
        selectedRows.flatMap((r) => (r.item ? [r.item] : [])),
      ),
    );

  const handleDelete = () =>
    runAction(async () => {
      await deleteEntries(toSelection());
      setSelection({ folderId, keys: new Set() });
      reload();
      return `${selectedRows.length}개를 휴지통으로 보냈습니다.`;
    });

  const tree = [
    {
      id: ROOT_ID,
      name: ROOT_NAME,
      children: folders.list ? buildFolderTree(folders.list) : [],
    },
  ];

  return (
    <>
      <FolderTree
        nodes={tree}
        selectedId={folderId}
        defaultExpanded={[ROOT_ID]}
        revealIds={path.map((p) => p.id)}
        onSelect={openFolder}
      />
      <MainColumn>
        <div className={styles.content}>
          <div className={styles.titleWrap}>
            <p className={styles.breadcrumb}>{pathNames.join(" › ")}</p>
            <p className={styles.title}>{pathNames[pathNames.length - 1]}</p>
          </div>
          <div className={styles.toolBar}>
            <button
              type="button"
              className={styles.button}
              disabled={isBusy}
              onClick={handleDownload}
            >
              다운로드
            </button>
            <button
              type="button"
              className={styles.button}
              disabled
              title="준비 중입니다"
            >
              공유
            </button>
            <button
              type="button"
              className={styles.button}
              disabled
              title="준비 중입니다"
            >
              이동
            </button>
            <button
              type="button"
              className={styles.button}
              disabled={isBusy}
              onClick={handleDelete}
            >
              삭제
            </button>
            <span className={styles.selectedCount}>
              {selectedRows.length}개 선택됨
            </span>
            {status && <span className={styles.status}>{status}</span>}
            <div className={styles.spacer} />
            <button type="button" className={styles.button}>
              정렬: 이름 ▾
            </button>
            <button type="button" className={styles.button}>
              그리드
            </button>
          </div>
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.headerRow}`}>
              <span className={styles.nameCol}>이름</span>
              <span className={styles.ownerCol}>소유자</span>
              <span className={styles.dateCol}>수정한 날짜</span>
              <span className={styles.sizeCol}>크기</span>
            </div>
            {loadError && <p className={styles.message}>{loadError}</p>}
            {!loadError && !rows && (
              <p className={styles.message}>불러오는 중...</p>
            )}
            {rows?.length === 0 && (
              <p className={styles.message}>
                {isRoot
                  ? "아직 파일이 없습니다. 업로드하면 내용에 맞는 폴더로 정리됩니다."
                  : "빈 폴더입니다."}
              </p>
            )}
            {rows?.map((row) => {
              const isSelected = selectedKeys.has(row.key);
              return (
                <div
                  key={row.key}
                  className={`${styles.row} ${isSelected ? styles.rowActive : ""}`}
                  title={row.type === "FOLDER" ? "두 번 클릭해서 열기" : undefined}
                  onClick={() => toggleRow(row.key)}
                  onDoubleClick={() =>
                    row.type === "FOLDER" && openFolder(row.id)
                  }
                >
                  <div className={styles.nameCol}>
                    <span className={styles.check} />
                    {row.type === "FOLDER" && (
                      <img
                        src="/assets/icon/folder.svg"
                        alt=""
                        className={styles.rowIcon}
                      />
                    )}
                    {row.item?.kind === "LINK" && (
                      <img
                        src="/assets/icon/link.svg"
                        alt=""
                        className={styles.rowIcon}
                      />
                    )}
                    <span className={styles.fileName}>{row.name}</span>
                  </div>
                  <span className={`${styles.cell} ${styles.ownerCol}`}>
                    나
                  </span>
                  <span className={`${styles.cell} ${styles.dateCol}`}>
                    {row.date}
                  </span>
                  <span className={`${styles.cell} ${styles.sizeCol}`}>
                    {row.size}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </MainColumn>
      {selectedFile && (
        <DetailPanel
          file={{
            name: selectedFile.name,
            owner: "나",
            date: formatDate(selectedFile.createdAt),
            size: formatBytes(selectedFile.sizeBytes),
            type: typeLabel(
              selectedFile.kind,
              selectedFile.name,
              selectedFile.mimeType,
            ),
          }}
          location={pathNames.join(" › ")}
          onClose={() => setSelection({ folderId, keys: new Set() })}
        />
      )}
    </>
  );
};

export default MyFiles;
