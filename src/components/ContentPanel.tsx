import type { ReactNode } from "react";
import styles from "../styles/components/ContentPanel.module.css";

interface ContentPanelProps {
  title: string;
  children?: ReactNode;
}

export const ContentPanel = ({ title, children }: ContentPanelProps) => {
  return (
    <div className={styles.panel}>
      <p className={styles.title}>{title}</p>
      {children}
    </div>
  );
};
