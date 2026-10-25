import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { searchDrive } from "../api/drive";
import type { DriveSearchItem } from "../api/drive";
import { MainColumn } from "../components/MainColumn";
import styles from "../styles/pages/Search.module.css";

const formatSize = (bytes: number | null) => {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  // 내 파일의 폴더에서 검색하면 그 폴더와 하위 폴더 안에서만 찾는다.
  const folderId = searchParams.get("folderId") ?? undefined;
  const key = `${q}\n${folderId ?? ""}`;
  const [result, setResult] = useState<{
    key: string;
    items?: DriveSearchItem[];
    error?: string;
  }>({ key: "" });

  useEffect(() => {
    if (!q) return;
    let ignore = false;
    searchDrive({ q, folderId })
      .then((items) => !ignore && setResult({ key, items }))
      .catch(
        (e) =>
          !ignore &&
          setResult({
            key,
            error: e instanceof Error ? e.message : "검색에 실패했습니다.",
          }),
      );
    return () => {
      ignore = true;
    };
  }, [q, folderId, key]);

  // 현재 검색어의 결과가 아직 없으면 로딩 중이다.
  const isLoading = !!q && result.key !== key;
  const { items, error } = result.key === key ? result : ({} as typeof result);

  return (
    <MainColumn>
      <div className={styles.content}>
        <p className={styles.title}>검색 결과</p>
        {q && <p className={styles.query}>“{q}”</p>}
        {folderId && (
          <p className={styles.message}>선택한 폴더와 하위 폴더에서 찾은 결과입니다.</p>
        )}
        {isLoading && <p className={styles.message}>검색 중...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {items && items.length === 0 && (
          <p className={styles.message}>검색 결과가 없습니다.</p>
        )}
        {items && items.length > 0 && (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.itemHead}>
                  <span className={styles.badge}>
                    {item.kind === "FILE" ? "파일" : "링크"}
                  </span>
                  {item.kind === "LINK" && item.url ? (
                    <a
                      className={styles.name}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span className={styles.name}>{item.name}</span>
                  )}
                  <span className={styles.similarity}>
                    유사도 {Math.round(item.similarity * 100)}%
                  </span>
                </div>
                <span className={styles.meta}>
                  <Link
                    className={styles.folderLink}
                    to={`/files?folder=${item.folderId}`}
                  >
                    {item.folderName}
                  </Link>
                  {item.sizeBytes !== null && ` · ${formatSize(item.sizeBytes)}`}
                </span>
                {item.summary && (
                  <p className={styles.summary}>{item.summary}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </MainColumn>
  );
};

export default Search;
