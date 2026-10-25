import { useState } from "react";
import type { DriveFolder } from "../api/drive";
import dialogStyles from "../styles/components/UploadDialog.module.css";
import styles from "../styles/components/MoveDialog.module.css";
import { buildFolderTree, type TreeNode } from "../utils/tree";

const ROOT = "root";

interface MoveDialogProps {
  folders: DriveFolder[];
  // 선택할 수 없는 폴더 (옮기는 폴더 자신과 그 하위, 지금 보고 있는 폴더)
  disabledIds: Set<string>;
  // 파일·링크는 폴더 안에만 둘 수 있어 최상위를 고를 수 없다.
  allowRoot: boolean;
  isBusy: boolean;
  onClose: () => void;
  onMove: (targetFolderId: string | null) => void;
}

// 옮기는 폴더의 하위 폴더까지 함께 막는다.
const withDescendants = (folders: DriveFolder[], ids: Set<string>) => {
  const blocked = new Set(ids);
  let grew = true;
  while (grew) {
    grew = false;
    for (const f of folders) {
      if (f.parentId && blocked.has(f.parentId) && !blocked.has(f.id)) {
        blocked.add(f.id);
        grew = true;
      }
    }
  }
  return blocked;
};

export const MoveDialog = ({
  folders,
  disabledIds,
  allowRoot,
  isBusy,
  onClose,
  onMove,
}: MoveDialogProps) => {
  const [target, setTarget] = useState<string | null>(null);
  const blocked = withDescendants(folders, disabledIds);
  const tree = buildFolderTree(folders);

  const renderNode = (node: TreeNode, depth: number) => {
    const isBlocked = blocked.has(node.id);
    return (
      <div key={node.id}>
        <button
          type="button"
          disabled={isBlocked}
          className={`${styles.option} ${target === node.id ? styles.optionActive : ""}`}
          style={{ paddingLeft: 12 + depth * 20 }}
          onClick={() => setTarget(node.id)}
        >
          <img src="/assets/icon/folder.svg" alt="" className={styles.icon} />
          {node.name}
        </button>
        {node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className={dialogStyles.overlay} onClick={onClose}>
      <div
        className={dialogStyles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="이동할 폴더 선택"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={dialogStyles.header}>
          <p className={dialogStyles.title}>이동할 폴더 선택</p>
          <button
            type="button"
            className={dialogStyles.close}
            aria-label="닫기"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className={styles.list}>
          <button
            type="button"
            disabled={!allowRoot}
            title={allowRoot ? undefined : "파일·링크는 폴더 안으로만 옮길 수 있습니다"}
            className={`${styles.option} ${target === ROOT ? styles.optionActive : ""}`}
            onClick={() => setTarget(ROOT)}
          >
            <img src="/assets/icon/folder.svg" alt="" className={styles.icon} />
            내 파일 (최상위)
          </button>
          {tree.map((node) => renderNode(node, 1))}
        </div>
        <p className={styles.hint}>같은 이름이 있으면 번호를 붙여 옮깁니다.</p>
        <div className={dialogStyles.footer}>
          <button type="button" className={dialogStyles.outlineButton} onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className={dialogStyles.doneButton}
            disabled={target === null || isBusy}
            onClick={() => onMove(target === ROOT ? null : target)}
          >
            이동
          </button>
        </div>
      </div>
    </div>
  );
};
