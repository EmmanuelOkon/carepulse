import Image from "next/image";
import Link from "next/link";

import PatientForm from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/PasskeyModal";

const currentYear = new Date().getFullYear();

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex items-center h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar overflow-y-auto w-full container flex flex-col max-h-screen">
        <div className="sub-container max-w-[496px] flex-1 justify-between py-10">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            />
          </Link>

          <PatientForm />

          <div className="text-14-regular mt-14 flex items-center justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © {currentYear} CarePulse
            </p>
            <Link
              href="/?admin=true"
              className="text-green-500 hover:bg-green-500 hover:text-white p-2 rounded-md "
            >
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />

      {/* <div className="bg-red-700 max-w-[50%] object-cover h-full ">
        
      </div> */}
    </div>
  );
}
