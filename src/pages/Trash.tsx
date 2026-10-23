import { useState } from "react";
import { MainColumn } from "../components/MainColumn";
import styles from "../styles/pages/Trash.module.css";

interface TrashItem {
  name: string;
  location: string;
  date: string;
  size: string;
}

// TODO: 휴지통 API 연동 전 임시 데이터
const ITEMS: TrashItem[] = [
  { name: "시안_초안.fig", location: "내 파일 › 프로젝트 › 디자인", date: "10월 23일", size: "9.8MB" },
  { name: "회의록_1020.docx", location: "내 파일 › 회의록", date: "10월 22일", size: "180KB" },
  { name: "스크린샷_old.png", location: "내 파일 › 이미지", date: "10월 20일", size: "1.4MB" },
  { name: "예산표_구버전.xlsx", location: "내 파일 › 문서", date: "10월 18일", size: "96KB" },
  { name: "촬영본_테스트.mp4", location: "내 파일 › 이미지", date: "10월 15일", size: "240MB" },
  { name: "임시 폴더", location: "내 파일", date: "10월 12일", size: "—" },
  { name: "로고_후보.zip", location: "내 파일 › 프로젝트 › 디자인", date: "10월 9일", size: "4.2MB" },
];

const Trash = () => {
  const [selectedName, setSelectedName] = useState<string | null>(null);

  return (
    <MainColumn>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <p className={styles.title}>휴지통</p>
        </div>
        <div className={styles.notice}>
          <p className={styles.noticeText}>
            휴지통의 항목은 30일 후 자동으로 영구 삭제됩니다.
          </p>
        </div>
        <div className={styles.table}>
          <div className={`${styles.row} ${styles.headerRow}`}>
            <span className={styles.nameCol}>이름</span>
            <span className={styles.locationCol}>원래 위치</span>
            <span className={styles.dateCol}>삭제한 날짜</span>
            <span className={styles.sizeCol}>크기</span>
          </div>
          {ITEMS.map((item) => {
            const isSelected = item.name === selectedName;
            return (
              <div
                key={item.name}
                className={`${styles.row} ${isSelected ? styles.rowActive : ""}`}
                onClick={() => setSelectedName(isSelected ? null : item.name)}
              >
                <div className={styles.nameCol}>
                  <span className={styles.check} />
                  <span className={styles.fileName}>{item.name}</span>
                </div>
                <span className={`${styles.cell} ${styles.locationCol}`}>
                  {item.location}
                </span>
                <span className={`${styles.cell} ${styles.dateCol}`}>
                  {item.date}
                </span>
                <span className={`${styles.cell} ${styles.sizeCol}`}>
                  {item.size}
                </span>
              </div>
            );
          })}
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.button}>
            복원
          </button>
          <button type="button" className={styles.button}>
            영구 삭제
          </button>
          <span className={styles.selectedCount}>
            {selectedName ? 1 : 0}개 선택됨
          </span>
        </div>
      </div>
    </MainColumn>
  );
};

export default Trash;
