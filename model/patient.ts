import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    avatar: { type: String, default: "https://example.com/avatar.jpg" },
    isVerified: { type: Boolean, default: false },
    privacyConsent: { type: Boolean, default: null },
    disclosureConsent: { type: Boolean, default: null },
    treatmentConsent: { type: Boolean, default: null },
    gender: { type: String, default: "male" },
    birthDate: { type: Date },
    address: { type: String },
    occupation: { type: String },
    emergencyContactName: { type: String },
    emergencyContactNumber: { type: String },
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    allergies: { type: String },
    currentMedication: { type: String },
    familyMedicalHistory: { type: String },
    pastMedicalHistory: { type: String },
    identificationType: { type: String },
    identificationNumber: { type: String },
    identificationDocumentId: { type: String },
    primaryPhysician: { type: String },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError by checking if the model is already registered
const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);

export default Patient;
