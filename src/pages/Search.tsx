import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
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
  const q = useSearchParams()[0].get("q") ?? "";
  const [result, setResult] = useState<{
    q: string;
    items?: DriveSearchItem[];
    error?: string;
  }>({ q: "" });

  useEffect(() => {
    if (!q) return;
    let ignore = false;
    searchDrive({ q })
      .then((items) => !ignore && setResult({ q, items }))
      .catch(
        (e) =>
          !ignore &&
          setResult({
            q,
            error: e instanceof Error ? e.message : "검색에 실패했습니다.",
          }),
      );
    return () => {
      ignore = true;
    };
  }, [q]);

  // 현재 검색어의 결과가 아직 없으면 로딩 중이다.
  const isLoading = !!q && result.q !== q;
  const { items, error } = result.q === q ? result : ({} as typeof result);

  return (
    <MainColumn>
      <div className={styles.content}>
        <p className={styles.title}>검색 결과</p>
        {q && <p className={styles.query}>“{q}”</p>}
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
                  {item.folderName}
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
