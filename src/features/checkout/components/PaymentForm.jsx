"use client";

import { useCallback } from "react";
import { ChevronRight, CreditCard, ArrowLeft, Banknote, Building2 } from "lucide-react";
import { useCheckout } from "../context/CheckoutContext";
import MagicFillButton from "./MagicFillButton";
import styles from "../styles/PaymentForm.module.css";

const PAYMENT_METHODS = [
  { id: "card", label: "Tarjeta de Crédito/Débito", icon: CreditCard },
  { id: "transfer", label: "Transferencia Bancaria", icon: Building2 },
  { id: "cash", label: "Efectivo (al retirar)", icon: Banknote },
];

export default function PaymentForm() {
  const {
    paymentMethod,
    cardDetails,
    setPaymentMethod,
    setCardField,
    autoFillPayment,
    goNext,
    goPrev,
  } = useCheckout();

  const handleCardChange = useCallback(
    (e) => {
      setCardField(e.target.name, e.target.value);
    },
    [setCardField]
  );

  return (
    <div className={styles.form}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLeft}>
          <CreditCard size={20} />
          <h3>Método de Pago</h3>
        </div>
        <MagicFillButton onFill={autoFillPayment} />
      </div>

      <div className={styles.methods}>
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method.id}
            className={`${styles.option} ${paymentMethod === method.id ? styles.optionSelected : ""}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <method.icon size={20} />
            <span>{method.label}</span>
            <div className={styles.radioDot} />
          </label>
        ))}
      </div>

      {paymentMethod === "card" && (
        <div className={styles.cardForm}>
          <div className={styles.row}>
            <div className={styles.group}>
              <label>Número de tarjeta</label>
              <input
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="0000 0000 0000 0000"
              />
            </div>
          </div>
          <div className={`${styles.row} ${styles.row3}`}>
            <div className={styles.group}>
              <label>Vencimiento</label>
              <input
                name="cardExpiry"
                value={cardDetails.cardExpiry}
                onChange={handleCardChange}
                placeholder="MM/AA"
              />
            </div>
            <div className={styles.group}>
              <label>CVC</label>
              <input
                name="cardCvc"
                value={cardDetails.cardCvc}
                onChange={handleCardChange}
                placeholder="123"
              />
            </div>
            <div className={styles.group}>
              <label>Titular</label>
              <input
                name="cardHolder"
                value={cardDetails.cardHolder}
                onChange={handleCardChange}
                placeholder="Nombre en la tarjeta"
              />
            </div>
          </div>
        </div>
      )}

      <div className={`${styles.actions} ${styles.actionsDual}`}>
        <button className={styles.btnSecondary} onClick={goPrev}>
          <ArrowLeft size={18} />
          Volver
        </button>
        <button className={styles.btnPrimary} onClick={goNext}>
          Revisar pedido
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
