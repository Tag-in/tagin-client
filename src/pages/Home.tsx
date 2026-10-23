import styles from "../styles/pages/Home.module.css";
import { Header } from "../components/Header";
import { SideBar } from "../components/SideBar";

const Home = () => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}></div>
      </div>
    </div>
  );
};

export default Home;
