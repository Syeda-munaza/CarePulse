import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/types";
// createResponseProps;
import SubmitButton from "../SubmitButton";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import { getAppointmentSchema } from "@/lib/schema";
import {
  createAppointment,
  reUpdateAppointment,
  UpdateAppointment,
} from "@/app/(actions)/appointment.actions";
import { useRouter } from "next/navigation";
import { Appointment } from "@/types/appwrite-type";
// import { createAppointment } from "@/app/(actions)/appointment.actions";

const AppointmentForm = ({
  userId,
  type = "create",
  appointment,
  setOpen,
}: {
  userId: string;
  patientId?: string;
  type: "create" | "schedule" | "cancel";
  appointment?: Appointment;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  const schema = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      doctor: appointment ? appointment?.doctor : "",
      schedule: appointment?.schedule
        ? new Date(appointment.schedule)
        : new Date(Date.now()),

      reason: appointment ? appointment.reason : "",
      notes: appointment?.notes || "",
      cancellationReason: appointment?.cancellationReason || "",
    } as Partial<z.infer<typeof schema>>, // ✅ Ensures TypeScript recognizes it
  });
  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    let status: "scheduled" | "cancelled" | "pending";
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      case "create":
        status = "pending";
        break;
      default:
        return;
    }
    try {
      if (type === "create" && userId) {
        const appointmentData = {
          ...values,
          status,
          userId,
        };

        const response = await createAppointment(appointmentData);
        if (response?.success && response?.data && "_id" in response.data) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${response.data._id}`
          );
        }
      }
      if (type === "cancel" && userId && appointment?.schedule) {
        const appointmentToUpdate = {
          appointmentId: appointment._id,
          status,
          userId,
          appointment: {
            patientName: appointment.patientName,
            schedule: appointment.schedule,
            reason: appointment.reason || "",
            notes: appointment.notes,
          },
          ...values,
        };
        const response = await UpdateAppointment(appointmentToUpdate);
        if (response) {
          if (setOpen) {
            setOpen(false);
          }
          form.reset();
        }
      }
      if (type === "schedule" && userId && appointment?.schedule) {
        const obj = form.getValues() as {
          doctor: string;
          schedule: string | Date;
          cancellationReason?: string;
        };

        const appointmentToUpdate = {
          _id: appointment?._id,
          appointment: {
            status: status as "scheduled" | "cancelled" | "pending",
            doctor: obj.doctor,
            schedule: new Date(obj.schedule),
          },
        };
        const updatedAppointment = await reUpdateAppointment(
          appointmentToUpdate
        );
        if (updatedAppointment) {
          if (setOpen) {
            setOpen(false);
          }
          form.reset();
        }
      }
    } catch (error) {
      console.error("Error creating/canceling appointment:", error);
    } finally {
      setIsLoading(false);
    }
  };
  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          {/* Render different sections based on type */}
          {(type === "create" || type === "schedule") && (
            <section className="mb-12 space-y-4">
              <h1 className="header">Hi there 👋</h1>
              <p className="text-dark-700">
                Request a new appointment in 10 seconds.
              </p>
            </section>
          )}
          {type === "cancel" && (
            <section className="mb-12 space-y-4">
              <h1 className="header">Cancel Appointment</h1>
              <p className="text-dark-700">
                You can request a new appointment anytime.
              </p>
            </section>
          )}

          {/* Appointment Creation Fields */}
          {(type === "create" || type === "schedule") && (
            <>
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="doctor"
                label="Doctor"
                placeholder="Select a Doctor"
              >
                {Doctors.map((doctor) => (
                  <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"
                      />
                      <p>{doctor.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Expected appointment date"
                showTimeSelect
                dateFormat="MM/dd/yyyy - h:mm aa"
              />

              <div className="double-input-group">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  label="Reason for appointment"
                  placeholder="Enter appointment reason"
                  disabled={type === "schedule"}
                />
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="notes"
                  label="Notes"
                  placeholder="Enter notes"
                  disabled={type === "schedule"}
                />
              </div>
            </>
          )}

          {/* Cancellation Reason Field (Only for Cancel Type) */}
          {type === "cancel" && (
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="cancellationReason"
              label="Reason for cancellation"
              placeholder="Enter reason for cancellation"
            />
          )}

          {/* Submit Button */}
          <SubmitButton
            isLoading={isLoading}
            className={`${
              type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
            } w-full`}
            handleClick={form.handleSubmit(onSubmit)}
          >
            {buttonLabel}
          </SubmitButton>
        </form>
      </Form>
    </>
  );
};
export default AppointmentForm;
