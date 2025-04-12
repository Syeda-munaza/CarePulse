"use client";
import PatientForm from "@/components/forms/PatientForm";
import PasskeyModel from "@/components/PasskeyModel";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const [user, setUser] = useState<"admin" | "patient" | "doctor">("patient");
  const searchParams = useSearchParams(); // Unwrap searchParams correctly
  const admin = searchParams.get("admin"); // Get the value safely
  const isAdmin = admin === "true";
  useEffect(() => {
    if (isAdmin) {
      setUser("admin");
    }
  }, [isAdmin]);
  const [loading, setLoading] = useState(false);
  const fetchLoading = (value: boolean) => {
    setLoading(value);
  };
  return (
    <>
      {loading ? (
        <div className="flex h-screen max-h-screen justify-center items-center">
          <ClipLoader color="shad-primary-btn" />
        </div>
      ) : (
        <div className="flex h-screen max-h-screen">
          {isAdmin && <PasskeyModel user={user} />}
          <section className="remove-scrollbar container my-auto">
            <div className="sub-container m-w-[496px]">
              <Image
                src="/assets/icons/logo-full.svg"
                width={1000}
                height={1000}
                alt="patient"
                className="mb-12 h-10 w-fit"
              />
              <PatientForm fetchLoading={fetchLoading} />
              <div className="text-14-regular mt-20 flex justify-between">
                <p className="justify-items-end text-dark-600 xl:text-left">
                  © 2025 CarePulse
                </p>
                <Link href="/?admin=true" className="text-green-500">
                  Admin
                </Link>
              </div>
            </div>
          </section>
          <Image
            src="/assets/images/onboarding-img.png"
            width={1000}
            height={1000}
            alt="onboarding-img"
            priority
            className="side-img max-w-[50%]"
          />
        </div>
      )}
    </>
  );
}
