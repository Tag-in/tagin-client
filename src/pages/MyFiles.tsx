import { useState } from "react";
import { DetailPanel } from "../components/DetailPanel";
import { FolderTree } from "../components/FolderTree";
import { MainColumn } from "../components/MainColumn";
import styles from "../styles/pages/MyFiles.module.css";
import type { FileItem } from "../types/file";
import { findTreePath, type TreeNode } from "../utils/tree";

// TODO: 폴더 트리 API 연동 전 임시 데이터
const TREE: TreeNode[] = [
  {
    id: "root",
    name: "내 파일",
    children: [
      {
        id: "project",
        name: "프로젝트",
        children: [
          {
            id: "design",
            name: "디자인",
            children: [
              { id: "wireframe", name: "와이어프레임" },
              { id: "asset", name: "에셋" },
            ],
          },
          { id: "plan", name: "기획", children: [] },
        ],
      },
      { id: "document", name: "문서", children: [] },
      { id: "image", name: "이미지", children: [] },
      { id: "minutes", name: "회의록", children: [] },
    ],
  },
];

// TODO: 파일 목록 API 연동 전 임시 데이터
const FILES: FileItem[] = [
  { name: "와이어프레임", owner: "나", date: "10월 24일", size: "—", type: "폴더" },
  { name: "에셋", owner: "나", date: "10월 22일", size: "—", type: "폴더" },
  { name: "메인화면_시안.fig", owner: "나", date: "10월 23일", size: "12.4MB", type: "Figma 파일" },
  { name: "로고_원본.png", owner: "나", date: "10월 21일", size: "2.1MB", type: "이미지" },
  { name: "컬러_가이드.pdf", owner: "팀원", date: "10월 20일", size: "860KB", type: "PDF 문서" },
  { name: "아이콘_세트.zip", owner: "팀원", date: "10월 19일", size: "5.7MB", type: "압축 파일" },
  { name: "스크린샷_1.png", owner: "나", date: "10월 18일", size: "1.3MB", type: "이미지" },
  { name: "스크린샷_2.png", owner: "나", date: "10월 18일", size: "1.1MB", type: "이미지" },
  { name: "발표자료.pptx", owner: "나", date: "10월 17일", size: "8.9MB", type: "프레젠테이션" },
  { name: "리서치_정리.docx", owner: "팀원", date: "10월 16일", size: "240KB", type: "Word 문서" },
];

const ACTIONS = ["다운로드", "공유", "이동", "삭제"];

const MyFiles = () => {
  const [folderId, setFolderId] = useState("design");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const path = findTreePath(TREE, folderId) ?? [];
  const selectedFile = FILES.find((file) => file.name === selectedName);

  return (
    <>
      <FolderTree
        nodes={TREE}
        selectedId={folderId}
        defaultExpanded={["root", "project", "design"]}
        onSelect={setFolderId}
      />
      <MainColumn>
        <div className={styles.content}>
          <div className={styles.titleWrap}>
            <p className={styles.breadcrumb}>{path.join(" › ")}</p>
            <p className={styles.title}>{path[path.length - 1]}</p>
          </div>
          <div className={styles.toolBar}>
            {ACTIONS.map((action) => (
              <button key={action} type="button" className={styles.button}>
                {action}
              </button>
            ))}
            <span className={styles.selectedCount}>
              {selectedFile ? 1 : 0}개 선택됨
            </span>
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
            {FILES.map((file) => {
              const isSelected = file.name === selectedName;
              return (
                <div
                  key={file.name}
                  className={`${styles.row} ${isSelected ? styles.rowActive : ""}`}
                  onClick={() => setSelectedName(isSelected ? null : file.name)}
                >
                  <div className={styles.nameCol}>
                    <span className={styles.check} />
                    <span className={styles.fileName}>{file.name}</span>
                  </div>
                  <span className={`${styles.cell} ${styles.ownerCol}`}>
                    {file.owner}
                  </span>
                  <span className={`${styles.cell} ${styles.dateCol}`}>
                    {file.date}
                  </span>
                  <span className={`${styles.cell} ${styles.sizeCol}`}>
                    {file.size}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </MainColumn>
      {selectedFile && (
        <DetailPanel
          file={selectedFile}
          location={path.join(" › ")}
          onClose={() => setSelectedName(null)}
        />
      )}
    </>
  );
};

export default MyFiles;
