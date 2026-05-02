export const sessionOptions = {
  password: process.env.SESSION_SECRET || "fallback-secret-change-in-production",
  cookieName: "ecommerce-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
