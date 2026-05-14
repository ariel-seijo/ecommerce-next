import styles from "../styles/CarouselSkeleton.module.css";

export default function CarouselSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonTrack} />
    </div>
  );
}
