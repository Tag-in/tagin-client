import { useEffect, useRef, useState } from "react";
import styles from "../styles/pages/Home.module.css";
import { FolderCard } from "../components/FolderCard";
import { FileCard } from "../components/FileCard";

const FOLDERS = ["운동", "게임", "요리", "음악", "예능"];
const VIEW_MODES = ["그리드", "리스트"];
// TODO: 최근 파일 API 연동 전 임시 데이터
const RECENT_FILES = [
  { name: "기획서_v3.pdf", date: "10월 24일", owner: "나" },
  { name: "메인화면_시안.fig", date: "10월 23일", owner: "나" },
  { name: "회의록_1024.docx", date: "10월 22일", owner: "팀원" },
  { name: "로고_원본.png", date: "10월 21일", owner: "나" },
  { name: "예산표.xlsx", date: "10월 20일", owner: "팀원" },
  { name: "발표자료.pptx", date: "10월 19일", owner: "나" },
  { name: "스크린샷_1.png", date: "10월 18일", owner: "나" },
  { name: "API_명세.md", date: "10월 17일", owner: "팀원" },
  { name: "촬영본_01.mp4", date: "10월 16일", owner: "나" },
  { name: "아이콘_세트.zip", date: "10월 15일", owner: "팀원" },
];

const Home = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isDateDesc, setIsDateDesc] = useState(true);
  const [viewMode, setViewMode] = useState(VIEW_MODES[0]);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isViewOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!viewRef.current?.contains(e.target as Node)) setIsViewOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isViewOpen]);

  return (
    <div className={styles.content}>
      <p className={styles.title}>홈</p>
      <div className={styles.toolBar}>
        <div className={styles.buttonWrap}>
          <button
            type="button"
            className={styles.fixDateWrap}
            onClick={() => setIsDateDesc((prev) => !prev)}
          >
            <span className={styles.fixDateText}>수정 날짜</span>
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
      <div className={styles.folderList}>
        {FOLDERS.map((name) => (
          <FolderCard
            key={name}
            name={name}
            fileCount={0}
            checked={selected === name}
            onToggle={() => setSelected(selected === name ? null : name)}
          />
        ))}
      </div>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>최근 파일</h2>
        <div className={styles.fileList}>
          {RECENT_FILES.map(({ name, date, owner }) => (
            <FileCard
              key={name}
              name={name}
              date={date}
              owner={owner}
              checked={selected === name}
              onToggle={() => setSelected(selected === name ? null : name)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
