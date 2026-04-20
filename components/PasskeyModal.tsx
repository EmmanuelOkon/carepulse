"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendAdminOtp, verifyAdminOtp } from "@/lib/actions/admin.actions";

export const PasskeyModal = () => {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSending(true);
    const result = await sendAdminOtp(email.trim());
    setIsSending(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setStep("otp");
  };

  const handleVerifyOtp = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-character OTP.");
      return;
    }

    setIsVerifying(true);
    const result = await verifyAdminOtp(email.trim(), otp);
    setIsVerifying(false);

    if (!result.success) {
      setError(result.message);
      setOtp("");
      return;
    }

    setOpen(false);
    router.push("/admin");
  };

  const handleResend = async () => {
    setError("");
    setIsSending(true);
    const result = await sendAdminOtp(email.trim());
    setIsSending(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) closeModal();
      }}
    >
      {step === "email" ? (
        <AlertDialogContent className="shad-alert-dialo bg-dark-400 border-dark-500 rounded-lg max-w-[280px] sm:max-w-sm md:max-w-lg ">
          <AlertDialogHeader>
            <div className="flex justify-end">
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={20}
                height={20}
                onClick={() => closeModal()}
                className="cursor-pointer"
              />
            </div>

            <AlertDialogTitle className="flex items-center justify-between text-white">
              Admin Access Verification
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              Enter your email to receive a one-time passcode.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="bg-dark-500 text-white border-dark-600"
              required
            />

            {error && (
              <p className="shad-error text-14-regular flex justify-center">
                {error}
              </p>
            )}

            <AlertDialogFooter>
              <AlertDialogAction
                type="submit"
                className="shad-primary-btn w-full"
                disabled={isSending}
              >
                {isSending ? "Sending OTP..." : "Send OTP"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      ) : (
        <AlertDialogContent className="shad-alert-dialo bg-dark-400 border-dark-500 rounded-lg max-w-[280px] sm:max-w-sm md:max-w-lg ">
          <AlertDialogHeader>
            <div className="flex justify-end">
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={20}
                height={20}
                onClick={() => closeModal()}
                className="cursor-pointer"
              />
            </div>

            <AlertDialogTitle className="flex items-center justify-between text-white">
              <h1>Enter OTP</h1>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white">
              We sent a 6-character code to {email}. It expires in 5 minutes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value.toUpperCase())}
            >
              <InputOTPGroup className="shad-otp">
                <InputOTPSlot className="shad-otp-slot" index={0} />
                <InputOTPSlot className="shad-otp-slot" index={1} />
                <InputOTPSlot className="shad-otp-slot" index={2} />
                <InputOTPSlot className="shad-otp-slot" index={3} />
                <InputOTPSlot className="shad-otp-slot" index={4} />
                <InputOTPSlot className="shad-otp-slot" index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p className="shad-error text-14-regular flex justify-center">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-white">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-green-400 hover:underline"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleResend}
                className="text-green-400 hover:underline"
                disabled={isSending}
              >
                {isSending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={(event) => handleVerifyOtp(event)}
              className="shad-primary-btn w-full"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};
