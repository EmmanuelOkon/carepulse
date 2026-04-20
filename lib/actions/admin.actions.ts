"use server";

import { ID } from "node-appwrite";
import {
  OTP_EXPIRY_MS,
  SESSION_EXPIRY_MS,
  clearOtpCookie,
  generateOtp,
  getOtpPayload,
  hashOtp,
  setAdminSessionCookie,
  setOtpCookie,
} from "../admin-session";
import { messaging, users } from "../appwrite.config";

const ensureOtpSecret = () => {
  if (!process.env.ADMIN_OTP_SECRET) {
    throw new Error("ADMIN_OTP_SECRET is not configured");
  }
};

const OTP_USER_ID = process.env.ADMIN_OTP_USER_ID ?? "admin-otp";
const OTP_USER_EMAIL =
  process.env.ADMIN_OTP_USER_EMAIL ?? "admin-otp@carepulse.local";
const OTP_USER_NAME = "Admin OTP";

const ensureOtpUser = async () => {
  try {
    await users.get(OTP_USER_ID);
  } catch (error: any) {
    if (error?.code === 404) {
      await users.create(
        OTP_USER_ID,
        OTP_USER_EMAIL,
        undefined,
        undefined,
        OTP_USER_NAME,
      );
      return;
    }

    if (error?.code !== 409) {
      throw error;
    }
  }
};

type ActionResult = {
  success: boolean;
  message: string;
};

export const sendAdminOtp = async (email: string): Promise<ActionResult> => {
  try {
    ensureOtpSecret();

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      return { success: false, message: "Email is required." };
    }

    const otp = generateOtp();
    const exp = Date.now() + OTP_EXPIRY_MS;

    await setOtpCookie({
      email: normalizedEmail,
      otpHash: hashOtp(otp, process.env.ADMIN_OTP_SECRET!),
      exp,
    });

    const subject = "Your CarePulse admin OTP";
    const content = `Your one-time passcode is ${otp}. It expires in 5 minutes.`;

    await ensureOtpUser();

    let targetId: string | null = null;

    try {
      const target = await (users as any).createTarget({
        userId: OTP_USER_ID,
        targetId: ID.unique(),
        providerType: "email",
        identifier: normalizedEmail,
      });

      targetId = target?.$id ?? null;

      if (!targetId) {
        return { success: false, message: "Unable to create email target." };
      }

      await (messaging as any).createEmail(
        ID.unique(),
        subject,
        content,
        [],
        [],
        [targetId],
      );
    } finally {
      if (targetId) {
        try {
          await (users as any).deleteTarget({
            userId: OTP_USER_ID,
            targetId,
          });
        } catch (cleanupError) {
          console.warn("Failed to delete OTP email target:", cleanupError);
        }
      }
    }

    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Failed to send admin OTP:", error);
    return {
      success: false,
      message: "Unable to send OTP. Please try again.",
    };
  }
};

export const verifyAdminOtp = async (
  email: string,
  otp: string,
): Promise<ActionResult> => {
  try {
    ensureOtpSecret();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedOtp = otp?.trim().toUpperCase();

    if (!normalizedEmail || !normalizedOtp) {
      return { success: false, message: "Email and OTP are required." };
    }

    const payload = await getOtpPayload();

    if (!payload) {
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      };
    }

    if (payload.email !== normalizedEmail) {
      return { success: false, message: "OTP email mismatch. Please resend." };
    }

    if (Date.now() > payload.exp) {
      await clearOtpCookie();
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      };
    }

    const hashed = hashOtp(normalizedOtp, process.env.ADMIN_OTP_SECRET!);
    if (hashed !== payload.otpHash) {
      return { success: false, message: "Invalid OTP. Please try again." };
    }

    await clearOtpCookie();
    await setAdminSessionCookie({
      email: normalizedEmail,
      exp: Date.now() + SESSION_EXPIRY_MS,
    });

    return { success: true, message: "OTP verified." };
  } catch (error) {
    console.error("Failed to verify admin OTP:", error);
    return {
      success: false,
      message: "Unable to verify OTP. Please try again.",
    };
  }
};
