"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomFormField from "../CustomFormField";
import { FormFieldType, registerFormProps } from "@/types";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Doctors, IdentificationTypes } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { registerFormSchema } from "@/lib/schema";
import { updatePatient } from "@/app/(actions)/patient.actions";

const RegisterForm = ({ id, name, email, phone }: registerFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: name,
      email: email,
      phone: phone,
      birthDate: new Date("01-01-2001"), // Pass a valid Date object
      gender: "male",
      address: "",
      occupation: "",
      insuranceProvider: "",
      currentMedication: "",
      insurancePolicyNumber: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      familyMedicalHistory: "",
      primaryPhysician: "",
      pastMedicalHistory: "",
      identificationType: "",
      identificationNumber: "",
      identificationDocument: [],
      treatmentConsent: false,
      disclosureConsent: false,
      privacyConsent: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    const result = await updatePatient(id, values);
      if (result?.success && result.data?.id) {
        router.push(`/patients/${result.data.id}/new-appointment`);
      } else {
        console.error("Failed to create patient:");
      }
    setIsLoading(false);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 flex-1"
        >
          <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
          </section>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>
          </section>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            disabled={true}
          />
          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="johndoe@gmail.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
              disabled={true}
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone number"
              placeholder="(555) 123-4567"
              disabled={true}
              value={phone}
            />
          </div>

          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of Birth"
              showTimeSelect={false}
            />
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              subCategory="radio"
            />
          </div>
          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="14th Street, New York"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
            />
          </div>
          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's name"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="(555) 123-4567"
            />
          </div>
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          {/* Second Info Section */}
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>
          </section>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a Physician"
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
          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
          </div>
          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medication (if any)"
              placeholder="Ibuprofen 200mg, Paracetamol 500mg"
            />
          </div>
          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label="Family medical history"
              placeholder="Mother had brain cancer, Father has hypertension"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
            />
          </div>
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          {/* Third info section */}
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification & Verification</h2>
            </div>
          </section>
          <div className="double-input-group">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="identificationType"
              label="Identification type"
              placeholder="Select an identification type"
            >
              {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="identificationNumber"
              label="Identification Number"
              placeholder="123456789"
            />
          </div>
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned copy of identification document"
            subCategory="fileSelector"
          />
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          {/* Fouth Info Section */}
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy</h2>
            </div>
          </section>
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatment"
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to disclosure of information"
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to privacy policy"
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
export default RegisterForm;
