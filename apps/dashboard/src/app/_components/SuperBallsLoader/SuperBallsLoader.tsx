import React from "react";
import styles from "./SuperBallsLoader.module.css";
import { cn } from "@dashboard/libs/utils";

const SuperBallsLoader = ({ className }: { className?: string }) => (
  <div className={cn(styles.container, className)}>
    <div className={styles.electron}></div>
    <div className={styles.electron}></div>
  </div>
);

export default SuperBallsLoader;
