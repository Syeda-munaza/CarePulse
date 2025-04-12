import mongoose, { Document } from "mongoose";

interface IAppointment extends Document {
  patientName: string;
  doctor?: string;
  schedule?: Date;
  reason?: string;
  notes?: string;
  cancellationReason?: string;
  status: "pending" | "cancelled" | "schedule";
  userId: string;
}

const appointmentSchema = new mongoose.Schema<IAppointment>(
  {
    patientName: { type: String, required: true },
    doctor: {
      type: String,
      required: function (this: IAppointment) {
        return !this.cancellationReason;
      },
    },
    schedule: {
      type: Date,
      required: function (this: IAppointment) {
        return !this.cancellationReason;
      },
    },
    reason: {
      type: String,
      required: function (this: IAppointment) {
        return !this.cancellationReason;
      },
    },
    notes: { type: String },
    cancellationReason: {
      type: String,
      required: function (this: IAppointment) {
        return !!this.cancellationReason;
      },
    },
    userId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      required: true,
      enum: ["pending", "cancelled", "scheduled"],
    },
  },
  { timestamps: true }
);

const Appointment =
  mongoose.models?.Appointment ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
