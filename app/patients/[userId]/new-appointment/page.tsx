"use client";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { RootState } from "@/types";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

const NewAppointment = () => {
  const patient = useSelector(
    (state: RootState) => state.patient.currentPatient
  );
  if (!patient || !patient.email) {
    redirect("/");
  }
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container m-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            width={1000}
            height={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm type="create" userId={patient.id} />
          <p className="copyright mt-10 py-12">© 2025 CarePulse</p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        width={1000}
        height={1000}
        alt="appointment"
        priority
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};
export default NewAppointment;
