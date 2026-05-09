const USD_TO_ARS = 1400;

const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function formatPrice(usdPrice) {
  return arsFormatter.format(usdPrice * USD_TO_ARS);
}

export function formatArs(arsPrice) {
  return arsFormatter.format(arsPrice);
}

export function usdToArs(usdPrice) {
  return usdPrice * USD_TO_ARS;
}
