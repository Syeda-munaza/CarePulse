"use server";

import Patient from "@/model/patient";
import connectToDatabase from "@/lib/db";
import { createPatientProps } from "@/types";
import { registerFormSchema } from "@/lib/schema";
import { z } from "zod";

export const createPatient = async ({
  name,
  email,
  phone,
}: createPatientProps) => {
  try {
    await connectToDatabase();
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient && existingPatient.treatmentConsent) {
      const { id: _id, name, email, phone, isVerified } = existingPatient;
      const existingUserData = { id: _id, name, email, phone, isVerified };
      return {
        success: true,
        oldUser: true,
        data: existingUserData,
      };
    } else if (existingPatient && !existingPatient.treatmentConsent) {
      const { id: _id, name, email, phone, isVerified } = existingPatient;
      const existingUserData = {
        id: _id,
        name,
        email,
        phone,
        isVerified,
      };
      return {
        success: true,
        oldUser: false,
        data: existingUserData,
      };
    } else {
      // Create a new patient
      const newPatient = await Patient.create({ name, email, phone });

      // Return the ID for redirection
      return {
        success: true,
        data: {
          id: newPatient._id.toString(),
          name: newPatient.name,
          email: newPatient.email,
          phone: newPatient.phone,
        },
      };
    }
  } catch (error) {
    console.error("Error creating patient:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};

export const updatePatient = async (
  patientId: string,
  updatedData: z.infer<typeof registerFormSchema>
) => {
  try {
    // Connect to the database
    await connectToDatabase();

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { $set: updatedData },
      { new: true, runValidators: true }
    );
    if (!updatedPatient) {
      return {
        success: false,
        message: "Patient not found",
      };
    }
    const dataToSend = {
      id: updatedPatient._id.toString(),
      name: updatedPatient.name,
      email: updatedPatient.email,
      phone: updatedPatient.phone,
    };
    // Return the updated patient data
    return {
      success: true,
      data: dataToSend,
    };
  } catch (error) {
    console.error("Error updating patient:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};
