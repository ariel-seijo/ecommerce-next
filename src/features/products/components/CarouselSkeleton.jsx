import styles from "../styles/CarouselSkeleton.module.css";

export default function CarouselSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonViewport}>
        <div className={styles.skeletonContainer}>
          <div className={styles.skeletonSlide}>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonContent}>
                <div className={`${styles.skeletonBar} ${styles.skeletonBarShort}`} />
                <div className={`${styles.skeletonBar} ${styles.skeletonBarMedium}`} />
                <div className={`${styles.skeletonBar} ${styles.skeletonBarMediumShort}`} />
                <div className={`${styles.skeletonBar} ${styles.skeletonBarShort}`} />
                <div className={`${styles.skeletonBar} ${styles.skeletonBarPrice}`} />
                <div className={styles.skeletonButton} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.skeletonDots}>
        <div className={styles.skeletonDot} />
        <div className={styles.skeletonDot} />
        <div className={styles.skeletonDot} />
      </div>
    </div>
  );
}
