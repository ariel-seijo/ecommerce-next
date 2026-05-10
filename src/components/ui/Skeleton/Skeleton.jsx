"use client";

import styles from "./Skeleton.module.css";

export default function Skeleton({
  width,
  height,
  variant = "rectangle",
  className = "",
  style,
  ...props
}) {
  const classes = [
    styles.skeleton,
    variant === "circle" && styles.circle,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inline = {
    width: width != null ? width : "100%",
    height: height != null ? height : "1em",
    ...style,
  };

  return (
    <div
      className={classes}
      style={inline}
      aria-hidden="true"
      {...props}
    />
  );
}
