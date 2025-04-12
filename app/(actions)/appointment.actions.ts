"use server";
import connectToDatabase from "@/lib/db";
import Appointment from "@/model/appointment";
import Patient from "@/model/patient";
import { revalidatePath } from "next/cache";

export interface AppointmentActionProps {
  userId: string;
  status: string;
  doctor?: string;
  schedule?: Date;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
}

export interface createResponseProps {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    status: string;
    doctor?: string;
    schedule?: Date;
    reason?: string;
    notes?: string;
    cancellationReason?: string;
    patientName?: string;
  }; // You can replace `any` with a more specific type if needed
}

export async function createAppointment(
  data: AppointmentActionProps
): Promise<createResponseProps> {
  try {
    await connectToDatabase();

    // Fetch the patient details
    const patient = await Patient.findById(data.userId);
    if (!patient) {
      return {
        success: false,
        message: "Patient not found",
      };
    }

    // Ensure `userId`, `status`, and `patientName` are always included
    const appointmentData: {
      userId: string;
      patientName: string; // ✅ Adding patientName directly in the appointment data
      status: string;
      doctor?: string;
      schedule?: Date;
      reason?: string;
      notes?: string;
      cancellationReason?: string;
    } = {
      userId: data.userId.toString(), // ✅ Convert ObjectId to string
      patientName: patient.name, // ✅ Storing patient's name in appointment
      status: data.status,
    };

    if (data.status === "cancelled") {
      appointmentData.cancellationReason = data.cancellationReason;
    } else if (data.status === "scheduled" || data.status === "pending") {
      appointmentData.doctor = data.doctor;
      appointmentData.schedule = data.schedule;
      appointmentData.reason = data.reason;
      appointmentData.notes = data.notes;
    }

    // Create and save the appointment
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    const plainAppointment = appointment.toObject();

    // Convert `_id`, `userId`, and `schedule` to serializable types
    plainAppointment._id = plainAppointment._id.toString();
    plainAppointment.userId = plainAppointment.userId.toString(); // ✅ Fix userId serialization

    if (plainAppointment.schedule) {
      plainAppointment.schedule = plainAppointment.schedule.toISOString();
    }

    return {
      success: true,
      message: "Appointment saved successfully",
      data: plainAppointment, // ✅ Now contains `patientName`
    };
  } catch (error) {
    console.error("Error saving appointment:", error);
    return {
      success: false,
      message: "Failed to save appointment",
    };
  }
}

export async function getAppointment(appointmentId: string) {
  try {
    await connectToDatabase();
    const appointmentDoc = await Appointment.findById(appointmentId);
    if (!appointmentDoc) return null;

    // Convert to plain object and ensure serializability
    const appointment = appointmentDoc.toObject();

    return {
      ...appointment,
      _id: appointment._id.toString(), // Convert ObjectId to string
      userId: appointment.userId.toString(), // Convert ObjectId to string if necessary
      createdAt: appointment.createdAt.toISOString(), // Convert Date to string
      updatedAt: appointment.updatedAt.toISOString(), // Convert Date to string
    };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return null;
  }
}

export async function getRecentAppointmentList() {
  try {
    await connectToDatabase();
    // Fetch appointments sorted by `createdAt` in descending order
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Count total appointments in the database
    const totalAppointments = await Appointment.countDocuments();

    // Compute counts based on status
    const counts = appointments.reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCounts += 1;
        } else if (appointment.status === "pending") {
          acc.pendingCounts += 1;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCounts += 1;
        }
        return acc;
      },
      { scheduledCounts: 0, pendingCounts: 0, cancelledCounts: 0 } // Initial values
    );

    // Transform appointment data for return
    const formattedAppointments = appointments.map((appointment) => ({
      _id: appointment._id.toString(),
      userId: appointment.userId.toString(),
      status: appointment.status,
      doctor: appointment.doctor,
      schedule: appointment.schedule,
      reason: appointment.reason,
      notes: appointment.notes,
      patientName: appointment.patientName,
      cancellationReason: appointment.cancellationReason,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    }));

    // Final structured data
    const data = {
      totalCounts: totalAppointments,
      ...counts,
      documents: formattedAppointments,
    };

    return JSON.stringify(data); // Ensure it's formatted for the response
  } catch (error) {
    console.error("Error fetching recent appointments:", error);
    throw new Error("Failed to retrieve recent appointments.");
  }
}
interface AppointmentDetails {
  cancellationReason?: string;
  patientName?: string;
  schedule: Date;
  reason?: string;
  notes?: string;
}

interface UpdateAppointmentParams {
  appointmentId: string; // ✅ Add this missing field
  userId: string;
  status: string;
  cancellationReason?: string;
  appointment: AppointmentDetails;
}

export const UpdateAppointment = async ({
  appointmentId,
  userId,
  status,
  appointment,
}: UpdateAppointmentParams): Promise<{
  success: boolean;
  message: string;
  setOpen?: (open: boolean) => void;
}> => {
  try {
    await connectToDatabase(); // ✅ Ensure DB connection

    if (!appointmentId) {
      return {
        success: false,
        message: "Appointment ID is required",
      };
    }

    // Prepare the update data
    const updateData: {
      userId?: string;
      status?: string;
      cancellationReason?: string;
      patientName?: string;
      schedule?: Date;
      reason?: string;
      notes?: string;
    } = {
      userId,
      status,
      ...(appointment && {
        cancellationReason: appointment.cancellationReason,
        patientName: appointment.patientName,
        schedule: appointment.schedule,
        reason: appointment.reason,
        notes: appointment.notes,
      }),
    };

    // Find and update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, runValidators: true }
    )
      .lean()
      .exec(); // ✅ Convert Mongoose document to a plain object and ensure single document

    if (!updatedAppointment || Array.isArray(updatedAppointment)) {
      return {
        success: false,
        message: "Appointment not found",
      };
    }
    revalidatePath("/admin");
    return {
      success: true,
      message: "Appointment updated successfully",
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      message: "Failed to update appointment",
    };
  }
};

export const reUpdateAppointment = async ({
  _id,
  appointment,
}: {
  _id?: string;
  appointment: {
    schedule: Date;
    status: "pending" | "scheduled" | "cancelled";
    doctor: string;
  };
}) => {
  try {
    // ✅ Validate _id
    if (!_id) {
      throw new Error("Appointment ID is required for updating.");
    }

    // ✅ Validate and format schedule
    const scheduleDate = new Date(appointment.schedule);
    if (isNaN(scheduleDate.getTime())) {
      throw new Error("Invalid date format for schedule.");
    }

    // ✅ Validate status
    const validStatuses = ["pending", "scheduled", "cancelled"];
    if (!validStatuses.includes(appointment.status)) {
      throw new Error("Invalid status value.");
    }

    // ✅ Validate doctor field
    if (!appointment.doctor || typeof appointment.doctor !== "string") {
      throw new Error("Doctor field is required and must be a string.");
    }

    // ✅ Ensure database connection
    try {
      await connectToDatabase();
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Database connection error.");
    }

    // ✅ Update appointment
    const updatedDocument = await Appointment.findByIdAndUpdate(
      _id,
      {
        doctor: appointment.doctor,
        schedule: scheduleDate, // Ensure it's a Date object
        status: appointment.status,
      },
      { new: true } // Return updated document
    );

    if (!updatedDocument) {
      throw new Error("Appointment not found or update failed.");
    }
    revalidatePath("/admin");

    return {
      success: true,
      message: "Appointment updated successfully.",
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      message: "Internal server error.",
    };
  }
};
