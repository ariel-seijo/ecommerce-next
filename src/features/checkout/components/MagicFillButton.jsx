"use client";

import { useState, useCallback } from "react";
import { Sparkles } from "lucide-react";
import styles from "../styles/MagicFill.module.css";

export default function MagicFillButton({ onFill, label = "Auto-completar" }) {
  const [flashing, setFlashing] = useState(false);

  const handleClick = useCallback(() => {
    setFlashing(true);
    onFill();
    setTimeout(() => setFlashing(false), 500);
  }, [onFill]);

  return (
    <button
      type="button"
      className={`${styles.magicBtn} ${flashing ? styles.filled : ""}`}
      onClick={handleClick}
    >
      <Sparkles size={14} />
      <span>{label}</span>
    </button>
  );
}
