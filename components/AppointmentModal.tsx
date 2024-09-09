"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

import AppointmentForm from "./forms/AppointmentForm";

import "react-datepicker/dist/react-datepicker.css";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title?: string;
  description?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize hover:text-white p-2 ${
            type === "schedule"
              ? "text-green-500 hover:bg-green-500 "
              : "text-red-500 hover:bg-red-400 "
          }`}
        >
          {type}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`shad-dialog rounded-md mt-4 mb-4 my-auto max-h-screen overflow-y-scroll sm:max-w-md remove-scrollbar  ${
          type === "schedule" ? "" : "hfit"
        } `}
      >
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">
            {type}&nbsp;&nbsp;Appointment
          </DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} an appointment
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-40 pb10">
          <AppointmentForm
            userId={userId}
            patientId={patientId}
            type={type}
            appointment={appointment}
            setOpen={setOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
