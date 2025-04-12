"use client";

import { getAppointment } from "@/app/(actions)/appointment.actions";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface Appointment {
  doctor?: string;
  schedule?: string;
}

const Success = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const searchParams = useSearchParams();

  const userId = params?.userId;
  const appointmentId = searchParams.get("appointmentId");

  const [appointment, setAppointment] = useState<Appointment>({});
  const [doctor, setDoctor] = useState<{ name?: string; image?: string }>({});

  useEffect(() => {
    if (!appointmentId) return;

    const fetchAppointment = async () => {
      try {
        const res = await getAppointment(appointmentId);
        setAppointment(res);

        const foundDoctor = Doctors.find((doc) => doc.name === res.doctor);
        setDoctor(foundDoctor || {}); // Ensure an empty object if not found
      } catch (error) {
        console.error("Error fetching appointment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  return (
    <>
      {loading ? (
        <>
          <div className="flex h-screen max-h-screen items-center justify-center">
            <ClipLoader color="shad-primary-btn" />
          </div>
        </>
      ) : (
        <div className="flex h-screen max-h-screen px-[5%]">
          <div className="success-img">
            <Link href="/">
              <Image
                src="/assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt="logo"
                className="h-10 w-fit"
              />
            </Link>
            <section className="flex flex-col items-center">
              <Image
                src="/assets/gifs/success.gif"
                height={300}
                width={280}
                alt="success"
                unoptimized
              />
              <h2 className="header mb-6 max-w-[600px] text-center">
                Your <span className="text-green-500">appointment request</span>{" "}
                has been successfully submitted!
              </h2>
              <p>We&apos;ll be in touch shortly to confirm.</p>
            </section>
            <section className="request-details">
              <p>Requested appointment details:</p>
              <div className="flex items-center gap-3">
                <Image
                  src={
                    doctor?.image
                      ? doctor?.image
                      : "/assets/icons/default-doctor.png"
                  }
                  alt="doctor"
                  width={100}
                  height={100}
                  className="size-6"
                />
                <p className="whitespace-nowrap">
                  Dr. {doctor?.name || "Unknown"}
                </p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/assets/icons/calendar.svg"
                  height={24}
                  width={24}
                  alt="calendar"
                />
                <p>
                  {appointment.schedule
                    ? formatDateTime(appointment.schedule).dateTime
                    : ""}
                </p>
              </div>
            </section>
            <Button variant="outline" className="shad-primary-btn" asChild>
              <Link href={`/patients/${userId}/new-appointment`}>
                New Appointment
              </Link>
            </Button>
            <p className="copyright">© 2025 CarePluse</p>
          </div>
        </div>
      )}
    </>
  );
};
export default Success;
