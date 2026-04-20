import crypto from "crypto";
import { cookies } from "next/headers";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MS = 5 * 60 * 1000;
export const SESSION_EXPIRY_MS = 30 * 60 * 1000;

const OTP_COOKIE_NAME = "admin_otp";
const SESSION_COOKIE_NAME = "admin_session";

const otpSecret = process.env.ADMIN_OTP_SECRET;
const sessionSecret =
  process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_OTP_SECRET;

type OtpPayload = {
  email: string;
  otpHash: string;
  exp: number;
};

type SessionPayload = {
  email: string;
  exp: number;
};

const signValue = (value: string, secret: string) =>
  crypto.createHmac("sha256", secret).update(value).digest("hex");

const encodePayload = (payload: Record<string, unknown>) =>
  Buffer.from(JSON.stringify(payload)).toString("base64url");

const decodePayload = <T>(value: string) =>
  JSON.parse(Buffer.from(value, "base64url").toString("utf-8")) as T;

const buildSignedValue = (payload: Record<string, unknown>, secret: string) => {
  const encoded = encodePayload(payload);
  return `${encoded}.${signValue(encoded, secret)}`;
};

const verifySignedValue = <T>(value: string, secret: string) => {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  if (signValue(encoded, secret) !== signature) return null;
  return decodePayload<T>(encoded);
};

export const generateOtp = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(OTP_LENGTH);
  return Array.from(bytes, (byte) => chars[byte % chars.length]).join("");
};

export const hashOtp = (otp: string, secret: string) => signValue(otp, secret);

export const setOtpCookie = async (payload: OtpPayload) => {
  if (!otpSecret) return;
  const cookieStore = await cookies();
  cookieStore.set(OTP_COOKIE_NAME, buildSignedValue(payload, otpSecret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(payload.exp),
    path: "/",
  });
};

export const getOtpPayload = async () => {
  if (!otpSecret) return null;
  const cookieStore = await cookies();
  const value = cookieStore.get(OTP_COOKIE_NAME)?.value;
  return verifySignedValue<OtpPayload>(value ?? "", otpSecret);
};

export const clearOtpCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(OTP_COOKIE_NAME);
};

export const setAdminSessionCookie = async (payload: SessionPayload) => {
  if (!sessionSecret) return;
  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    buildSignedValue(payload, sessionSecret),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(payload.exp),
      path: "/",
    },
  );
};

export const getAdminSession = async () => {
  if (!sessionSecret) return null;
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = verifySignedValue<SessionPayload>(value ?? "", sessionSecret);
  if (!payload) return null;
  if (Date.now() > payload.exp) {
    await clearAdminSession();
    return null;
  }
  return payload;
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
};
