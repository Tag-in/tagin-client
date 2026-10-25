import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  getFolders,
  getRecent,
  getStarred,
  type DriveFolder,
  type DriveItemWithFolder,
} from "../api/drive";
import { FileCard } from "../components/FileCard";
import { FolderCard } from "../components/FolderCard";
import { MainColumn } from "../components/MainColumn";
import { useDriveChanged } from "../lib/driveEvents";
import styles from "../styles/pages/Home.module.css";
import { formatDate } from "../utils/format";

// 보기: 최근 파일 / 중요 표시한 파일
const VIEW_MODES = ["최근", "중요"] as const;
type ViewMode = (typeof VIEW_MODES)[number];
const RECENT_LIMIT = 10;

const errorText = (e: unknown, fallback: string) =>
  e instanceof Error ? e.message : fallback;

const Home = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [isDateDesc, setIsDateDesc] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES[0]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);

  // 업로드·삭제 뒤 다시 불러오기 위한 버전
  const [version, setVersion] = useState(0);
  useDriveChanged(() => setVersion((v) => v + 1));

  const [folders, setFolders] = useState<{ list?: DriveFolder[]; error?: string }>({});
  const [files, setFiles] = useState<{
    key: string;
    list?: DriveItemWithFolder[];
    error?: string;
  }>({ key: "" });

  useEffect(() => {
    let ignore = false;
    getFolders()
      .then((list) => !ignore && setFolders({ list }))
      .catch((e) => !ignore && setFolders({ error: errorText(e, "폴더를 불러오지 못했습니다.") }));
    return () => {
      ignore = true;
    };
  }, [version]);

  const filesKey = `${viewMode}:${version}`;
  useEffect(() => {
    let ignore = false;
    const load =
      viewMode === "중요"
        ? getStarred().then((starred) => starred.items)
        : getRecent(RECENT_LIMIT);
    load
      .then((list) => !ignore && setFiles({ key: filesKey, list }))
      .catch(
        (e) =>
          !ignore &&
          setFiles({ key: filesKey, error: errorText(e, "파일을 불러오지 못했습니다.") }),
      );
    return () => {
      ignore = true;
    };
  }, [viewMode, filesKey]);

  useEffect(() => {
    if (!isViewOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!viewRef.current?.contains(e.target as Node)) setIsViewOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isViewOpen]);

  const rootFolders = folders.list?.filter((f) => f.parentId === null) ?? [];
  const current = files.key === filesKey ? files : undefined;
  const sortedFiles = current?.list
    ?.slice()
    .sort((a, b) =>
      isDateDesc
        ? b.createdAt.localeCompare(a.createdAt)
        : a.createdAt.localeCompare(b.createdAt),
    );

  const openFolder = (id: string) => navigate(`/files?folder=${id}`);

  return (
    <MainColumn>
      <div className={styles.content}>
        <p className={styles.title}>홈</p>
        <div className={styles.toolBar}>
          <div className={styles.buttonWrap}>
            <button
              type="button"
              className={styles.fixDateWrap}
              onClick={() => setIsDateDesc((prev) => !prev)}
            >
              <span className={styles.fixDateText}>추가한 날짜</span>
              <span
                className={`${styles.fixDateArrow} ${isDateDesc ? "" : styles.fixDateArrowUp}`}
              >
                ▾
              </span>
            </button>
            <div className={styles.optionWrap} ref={viewRef}>
              <button
                type="button"
                className={styles.option}
                aria-haspopup="listbox"
                aria-expanded={isViewOpen}
                onClick={() => setIsViewOpen((prev) => !prev)}
              >
                <span className={styles.optionText}>{viewMode}</span>
                <span
                  className={`${styles.fixDateArrow} ${isViewOpen ? styles.fixDateArrowUp : ""}`}
                >
                  ▾
                </span>
              </button>
              {isViewOpen && (
                <ul className={styles.dropdown} role="listbox">
                  {VIEW_MODES.map((mode) => (
                    <li key={mode} role="option" aria-selected={mode === viewMode}>
                      <button
                        type="button"
                        className={`${styles.dropdownItem} ${mode === viewMode ? styles.dropdownItemActive : ""}`}
                        onClick={() => {
                          setViewMode(mode);
                          setIsViewOpen(false);
                        }}
                      >
                        {mode}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        {folders.error && <p className={styles.message}>{folders.error}</p>}
        {rootFolders.length > 0 && (
          <div className={styles.folderList}>
            {rootFolders.map((folder) => (
              <div
                key={folder.id}
                title="두 번 클릭해서 열기"
                onDoubleClick={() => openFolder(folder.id)}
              >
                <FolderCard
                  name={folder.name}
                  fileCount={folder.itemCount}
                  checked={selected === folder.id}
                  onToggle={() => setSelected(selected === folder.id ? null : folder.id)}
                />
              </div>
            ))}
          </div>
        )}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {viewMode === "중요" ? "중요 파일" : "최근 파일"}
          </h2>
          {current?.error && <p className={styles.message}>{current.error}</p>}
          {!current && <p className={styles.message}>불러오는 중...</p>}
          {sortedFiles?.length === 0 && (
            <p className={styles.message}>
              {viewMode === "중요"
                ? "중요 표시한 파일이 없습니다."
                : "아직 파일이 없습니다. 업로드하면 내용에 맞는 폴더로 정리됩니다."}
            </p>
          )}
          {sortedFiles && sortedFiles.length > 0 && (
            <div className={styles.fileList}>
              {sortedFiles.map((item) => (
                <div
                  key={item.id}
                  title={`${item.folderName} 폴더 · 두 번 클릭해서 폴더 열기`}
                  onDoubleClick={() => openFolder(item.folderId)}
                >
                  <FileCard
                    name={item.name}
                    date={formatDate(item.createdAt)}
                    owner={item.folderName}
                    checked={selected === item.id}
                    onToggle={() => setSelected(selected === item.id ? null : item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainColumn>
  );
};

export default Home;
