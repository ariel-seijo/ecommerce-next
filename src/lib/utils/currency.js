let _cachedRate = 1400;
let _version = 0;
let _loading = null;

const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

/* ─── server-side ─── */

async function _fetchFromDb() {
  const { prisma } = await import("@/lib/prisma");
  const settings = await prisma.siteSettings.upsert({
    where: { id: "site_settings" },
    update: {},
    create: { id: "site_settings", usdToArs: 1400 },
  });
  return settings.usdToArs;
}

/* ─── client-side ─── */

function _isClient() {
  return typeof window !== "undefined";
}

async function _fetchFromApi() {
  const res = await fetch("/api/settings/exchange-rate");
  if (!res.ok) throw new Error("Failed to fetch exchange rate");
  const data = await res.json();
  return data.usdToArs;
}

/* ─── bootstrap ─── */

function _bootstrap() {
  if (_loading) return;
  const versionAtStart = _version;

  if (_isClient()) {
    const stored = sessionStorage.getItem("usdToArs");
    if (stored) {
      const parsed = Number(stored);
      if (!isNaN(parsed) && parsed > 0) {
        _cachedRate = parsed;
      }
    }
    _loading = _fetchFromApi()
      .then((rate) => {
        if (_version === versionAtStart) {
          _cachedRate = rate;
          sessionStorage.setItem("usdToArs", String(rate));
        }
      })
      .catch(() => {});
  } else {
    _loading = _fetchFromDb()
      .then((rate) => {
        if (_version === versionAtStart) {
          _cachedRate = rate;
        }
      })
      .catch(() => {});
  }
}

/* ─── public API ─── */

export async function refreshExchangeRate() {
  const rate = _isClient() ? await _fetchFromApi() : await _fetchFromDb();
  _cachedRate = rate;
  _version++;
  if (_isClient()) {
    sessionStorage.setItem("usdToArs", String(rate));
  }
  return rate;
}

export function invalidateExchangeRate(newRate) {
  _cachedRate = newRate;
  _version++;
  if (_isClient()) {
    sessionStorage.setItem("usdToArs", String(newRate));
  }
}

export async function getExchangeRateAsync() {
  return refreshExchangeRate();
}

export function formatPrice(usdPrice) {
  _bootstrap();
  return arsFormatter.format(usdPrice * _cachedRate);
}

export function formatArs(arsPrice) {
  return arsFormatter.format(arsPrice);
}

export function usdToArs(usdPrice) {
  _bootstrap();
  return usdPrice * _cachedRate;
}

export function arsToUsd(arsPrice) {
  _bootstrap();
  return arsPrice / _cachedRate;
}
