"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType } from "@/types";
import { patientSchema } from "@/lib/schema";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPatient } from "@/app/(actions)/patient.actions";
import { useDispatch } from "react-redux";
import { basicDataStart, basicDataSuccess } from "@/redux/patient/patientSlice";

const PatientForm = ({
  fetchLoading,
}: {
  fetchLoading: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof patientSchema>) => {
    setIsLoading(true);
    dispatch(basicDataStart());
    const { name, email, phone } = values;

    const result = await createPatient({ name, email, phone });
    dispatch(basicDataSuccess(result.data));
    if (result.oldUser) {
      router.push(`/patients/${result.data.id}/new-appointment`);
      fetchLoading(true);
    } else {
      if (result?.success && result.data?.id) {
        router.push(`/patients/${result.data.id}/register`);
        fetchLoading(true);
        setIsLoading(false);
      } else {
        console.error(
          "Failed to create patient:",
          result?.message || "Unknown error"
        );
        setIsLoading(false);

        // Optional: Handle the error state in your UI (e.g., show an error message).
      }
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule your first appointment.</p>
          </section>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567"
          />
          <SubmitButton
            isLoading={isLoading}
            handleClick={form.handleSubmit(onSubmit)}
          >
            Get Started
          </SubmitButton>
        </form>
      </Form>
    </>
  );
};
export default PatientForm;
