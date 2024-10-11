// 🔩 Base
import styles from "./loader-super-balls.module.css";
import { cn } from "@/utils/tailwind";

const SuperBallsLoader = ({ className }: { className?: string }) => (
  <div className={cn(styles.container, className)}>
    <div className={styles.electron}></div>
    <div className={styles.electron}></div>
  </div>
);

export default SuperBallsLoader;
