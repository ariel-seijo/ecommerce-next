"use client";

import "./Checkout.css";
import { useState } from "react";
import { useCart } from "@/features/cart/useCart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Check,
  ChevronRight,
  MapPin,
  CreditCard,
  PackageOpen,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const DEPARTMENTS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const PAYMENT_METHODS = [
  { id: "card", label: "Tarjeta de Crédito/Débito", icon: CreditCard },
  { id: "transfer", label: "Transferencia Bancaria", icon: CreditCard },
  { id: "cash", label: "Efectivo (al retirar)", icon: CreditCard },
];

const STEPS = ["Envío", "Pago", "Revisión"];

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "",
    zip: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 50000 ? 0 : 3500;
  const total = subtotal + shippingCost;

  const isEmpty = cart.length === 0;

  const validateShipping = () => {
    const errs = {};
    if (!shipping.fullName.trim()) errs.fullName = "Requerido";
    if (!shipping.email.trim()) errs.email = "Requerido";
    if (!shipping.address.trim()) errs.address = "Requerido";
    if (!shipping.city.trim()) errs.city = "Requerido";
    if (!shipping.department) errs.department = "Requerido";
    if (!shipping.zip.trim()) errs.zip = "Requerido";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePlaceOrder = () => {
    clearCart();
    setConfirmed(true);
  };

  if (isEmpty && !confirmed) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <ShoppingBag size={64} strokeWidth={1} />
          <h2>Tu carrito está vacío</h2>
          <p>Agregá productos para comenzar tu compra.</p>
          <Link href="/" className="checkout-back-link">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">
            <Check size={40} strokeWidth={2} />
          </div>
          <h2>¡Pedido Confirmado!</h2>
          <p>
            Gracias por tu compra. Te enviamos un email con los detalles a{" "}
            <strong>{shipping.email}</strong>.
          </p>
          <Link href="/" className="checkout-back-link">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-steps">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`checkout-step ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}
            >
              <div className="step-indicator">
                {i < step ? <Check size={16} /> : <span>{i + 1}</span>}
              </div>
              <span className="step-label">{label}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-col">
            {step === 0 && (
              <div className="checkout-form">
                <div className="form-section-header">
                  <MapPin size={20} />
                  <h3>Información de Envío</h3>
                </div>

                <div className="form-row">
                  <div className={`form-group ${errors.fullName ? "error" : ""}`}>
                    <label>Nombre completo</label>
                    <input
                      name="fullName"
                      value={shipping.fullName}
                      onChange={handleShippingChange}
                      placeholder="Ej: Juan Pérez"
                    />
                    {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                  </div>
                </div>

                <div className="form-row form-row-2">
                  <div className={`form-group ${errors.email ? "error" : ""}`}>
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={shipping.email}
                      onChange={handleShippingChange}
                      placeholder="juan@mail.com"
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      name="phone"
                      value={shipping.phone}
                      onChange={handleShippingChange}
                      placeholder="+54 11..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group ${errors.address ? "error" : ""}`}>
                    <label>Dirección</label>
                    <input
                      name="address"
                      value={shipping.address}
                      onChange={handleShippingChange}
                      placeholder="Calle, número, piso, depto"
                    />
                    {errors.address && <span className="form-error">{errors.address}</span>}
                  </div>
                </div>

                <div className="form-row form-row-3">
                  <div className={`form-group ${errors.city ? "error" : ""}`}>
                    <label>Ciudad</label>
                    <input
                      name="city"
                      value={shipping.city}
                      onChange={handleShippingChange}
                      placeholder="Ciudad"
                    />
                    {errors.city && <span className="form-error">{errors.city}</span>}
                  </div>
                  <div className={`form-group ${errors.department ? "error" : ""}`}>
                    <label>Provincia</label>
                    <select
                      name="department"
                      value={shipping.department}
                      onChange={handleShippingChange}
                    >
                      <option value="">Seleccionar</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errors.department && <span className="form-error">{errors.department}</span>}
                  </div>
                  <div className={`form-group ${errors.zip ? "error" : ""}`}>
                    <label>Código Postal</label>
                    <input
                      name="zip"
                      value={shipping.zip}
                      onChange={handleShippingChange}
                      placeholder="CP"
                    />
                    {errors.zip && <span className="form-error">{errors.zip}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Notas adicionales (opcional)</label>
                    <textarea
                      name="notes"
                      value={shipping.notes}
                      onChange={handleShippingChange}
                      placeholder="Indicaciones para la entrega..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="checkout-btn-primary"
                    onClick={() => {
                      if (validateShipping()) setStep(1);
                    }}
                  >
                    Continuar al pago
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="checkout-form">
                <div className="form-section-header">
                  <CreditCard size={20} />
                  <h3>Método de Pago</h3>
                </div>

                <div className="payment-methods">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      className={`payment-option ${paymentMethod === method.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <method.icon size={20} />
                      <span>{method.label}</span>
                      <div className="payment-check" />
                    </label>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="card-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Número de tarjeta</label>
                        <input placeholder="0000 0000 0000 0000" />
                      </div>
                    </div>
                    <div className="form-row form-row-3">
                      <div className="form-group">
                        <label>Vencimiento</label>
                        <input placeholder="MM/AA" />
                      </div>
                      <div className="form-group">
                        <label>CVC</label>
                        <input placeholder="123" />
                      </div>
                      <div className="form-group">
                        <label>Titular</label>
                        <input placeholder="Nombre en la tarjeta" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-actions form-actions-dual">
                  <button
                    className="checkout-btn-secondary"
                    onClick={() => setStep(0)}
                  >
                    <ArrowLeft size={18} />
                    Volver
                  </button>
                  <button
                    className="checkout-btn-primary"
                    onClick={() => setStep(2)}
                  >
                    Revisar pedido
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-form">
                <div className="form-section-header">
                  <PackageOpen size={20} />
                  <h3>Revisá tu Pedido</h3>
                </div>

                <div className="review-section">
                  <div className="review-block">
                    <h4>Dirección de envío</h4>
                    <p>{shipping.fullName}</p>
                    <p>{shipping.address}</p>
                    <p>
                      {shipping.city}, {shipping.department} - CP{" "}
                      {shipping.zip}
                    </p>
                    <p>{shipping.email}</p>
                    {shipping.phone && <p>{shipping.phone}</p>}
                  </div>

                  <div className="review-block">
                    <h4>Método de pago</h4>
                    <p>
                      {
                        PAYMENT_METHODS.find((m) => m.id === paymentMethod)
                          ?.label
                      }
                    </p>
                  </div>

                  <div className="review-items">
                    {cart.map((item) => (
                      <div key={item.id} className="review-item">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          width={60}
                          height={60}
                        />
                        <div className="review-item-info">
                          <span className="review-item-title">
                            {item.title}
                          </span>
                          <span className="review-item-qty">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="review-item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions form-actions-dual">
                  <button
                    className="checkout-btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft size={18} />
                    Volver
                  </button>
                  <button
                    className="checkout-btn-confirm"
                    onClick={handlePlaceOrder}
                  >
                    Confirmar pedido
                    <Check size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="checkout-summary-col">
            <div className="checkout-summary">
              <h3>Resumen de Compra</h3>

              <ul className="summary-items">
                {cart.map((item) => (
                  <li key={item.id}>
                    <div className="summary-item-img">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={48}
                        height={48}
                      />
                      <span className="summary-item-qty-badge">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="summary-item-info">
                      <span className="summary-item-title">{item.title}</span>
                    </div>
                    <span className="summary-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="summary-divider" />

              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Envío</span>
                <span className={shippingCost === 0 ? "free-shipping" : ""}>
                  {shippingCost === 0 ? "GRATIS" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              {shippingCost > 0 && (
                <p className="free-shipping-hint">
                  ¡Envío gratis en compras superiores a $50.000!
                </p>
              )}

              <div className="summary-divider" />

              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
