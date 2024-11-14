import styles from "./loader-circle.module.css";

const LoaderCircle = ({ color }: { color: string }) => (
  <svg
    className={styles.container}
    viewBox="0 0 40 40"
    height="40"
    width="40"
  >
    <circle
      className={styles.track}
      cx="10"
      cy="10"
      r="8.75"
      pathLength="100"
      stroke-width="5px"
      fill="none"
    />
    <circle
      className={styles.car}
      cx="20"
      cy="20"
      r="8.75"
      pathLength="100"
      stroke-width="3px"
      fill="none"
      style={{ stroke: color }}
    />
  </svg>
);

export default LoaderCircle;
