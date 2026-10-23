import { useState } from "react";
import { Outlet } from "react-router";
import { SideBar } from "../components/SideBar";
import { UploadDialog } from "../components/UploadDialog";
import styles from "../styles/app.module.css";

const Shell = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className={styles.container}>
      <SideBar onUpload={() => setIsUploadOpen(true)} />
      <Outlet />
      {isUploadOpen && <UploadDialog onClose={() => setIsUploadOpen(false)} />}
    </div>
  );
};

export default Shell;
