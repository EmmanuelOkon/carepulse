import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";

type Props = {};

const NewAppointment = async ({ params: { userId } }: SearchParamProps) => {

  const patient = await getPatient(userId);

  const currentYear = new Date().getFullYear();


  return (
    <div className="flex h-screen items-center max-h-screen">
      <section className="remove-scrollbar overflow-y-auto w-full container flex flex-col max-h-screen">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm
            type="create"
            patientId={patient?.$id}
            userId={userId}
          />

          <p className="copyright mt-10 py-12">© {currentYear} CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default NewAppointment;
