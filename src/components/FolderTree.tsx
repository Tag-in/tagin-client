import { useState } from "react";
import styles from "../styles/components/FolderTree.module.css";
import type { TreeNode } from "../utils/tree";

interface FolderTreeProps {
  nodes: TreeNode[];
  selectedId: string;
  defaultExpanded: string[];
  onSelect: (id: string) => void;
}

export const FolderTree = ({
  nodes,
  selectedId,
  defaultExpanded,
  onSelect,
}: FolderTreeProps) => {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded),
  );

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth: number) => {
    const hasChildren = !!node.children?.length;
    const isOpen = expanded.has(node.id);
    const isActive = node.id === selectedId;

    return (
      <div key={node.id} className={styles.group}>
        <div
          role="treeitem"
          aria-selected={isActive}
          className={`${styles.item} ${isActive ? styles.active : ""}`}
          style={{ paddingLeft: 8 + depth * 20 }}
          onClick={() => onSelect(node.id)}
        >
          <span
            className={styles.arrow}
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggle(node.id);
            }}
          >
            {hasChildren ? (isOpen ? "▾" : "▸") : ""}
          </span>
          <span className={styles.icon} />
          <span className={styles.name}>{node.name}</span>
        </div>
        {hasChildren &&
          isOpen &&
          node.children!.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <aside className={styles.container}>
      <p className={styles.title}>폴더 트리</p>
      <div className={styles.tree} role="tree">
        {nodes.map((node) => renderNode(node, 0))}
      </div>
    </aside>
  );
};
