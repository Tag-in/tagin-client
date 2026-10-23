import type { ReactNode } from "react";
import styles from "../styles/components/MainColumn.module.css";
import { Header } from "./Header";

interface MainColumnProps {
  children: ReactNode;
}

export const MainColumn = ({ children }: MainColumnProps) => {
  return (
    <div className={styles.main}>
      <Header />
      {children}
    </div>
  );
};
