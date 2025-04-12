"use client";

import React, { useState, useEffect } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import StatCard from "@/components/StatCard";
import Image from "next/image";
import Link from "next/link";
import { getRecentAppointmentList } from "../(actions)/appointment.actions";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/columns";
import { ClipLoader } from "react-spinners";

const Admin = () => {
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [appointments, setAppointments] = useState({
    scheduledCounts: 0,
    pendingCounts: 0,
    cancelledCounts: 0,
    documents: [] as [], // Explicitly define `documents` as an empty array
  });

  const [loading, setLoading] = useState(false); // Track loading state

  const fetchAppointments = async () => {
    setLoading(true); // Start animation
    try {
      const data = await getRecentAppointmentList();
      setAppointments(JSON.parse(data));
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setDashboardLoading(false);
    }
    setTimeout(() => setLoading(false), 1000); // Stop animation after 1s
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
  return (
    <>
      {dashboardLoading ? (
        <>
          <div className="flex h-screen items-center justify-center">
            <ClipLoader color="shad-primary-btn" />
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto flex max-w-7xl flex-col space-y-14">
            <header className="admin-header w-fullAQnvg21ewbfvbc ">
              <Link href="/" className="cursor-pointer">
                <Image
                  src="/assets/icons/logo-full.svg"
                  height={32}
                  width={162}
                  alt="logo"
                  className="h-8 w-fit"
                />
              </Link>

              <p className="text-16-semibold">Admin Dashboard</p>
            </header>

            <main className="admin-main">
              <section className="w-full space-y-4">
                <h1 className="header">Welcome 👋</h1>
                <p className="text-dark-700">
                  Start the day with managing new appointments
                </p>
                <button
                  onClick={fetchAppointments}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                  disabled={loading} // Disable button while loading
                >
                  <FiRefreshCcw
                    className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </section>

              <section className="admin-stat">
                <StatCard
                  type="appointments"
                  count={appointments?.scheduledCounts}
                  label="Scheduled appointments"
                  icon={"/assets/icons/appointments.svg"}
                />
                <StatCard
                  type="pending"
                  count={appointments.pendingCounts}
                  label="Pending appointments"
                  icon={"/assets/icons/pending.svg"}
                />
                <StatCard
                  type="cancelled"
                  count={appointments.cancelledCounts}
                  label="Cancelled appointments"
                  icon={"/assets/icons/cancelled.svg"}
                />
              </section>

              <DataTable columns={columns} data={appointments?.documents} />
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Admin;
