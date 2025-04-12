import { Control, FieldValues } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

export type CustomProps = {
  control: Control<any>;
  name: string;
  value?: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  subCategory?: "radio" | "fileSelector"; // New property with defined type
};
export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export type RenderFieldProps = {
  field: any;
  value?: string;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  control: Control<FieldValues>;
  subCategory?: "radio" | "fileSelector";
};

export type SubmitButtonProps = {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
  handleClick: () => void;
};

// Correct type for SearchParamProps
// export type SearchParamProps = {
//   searchParams: Record<string, string | undefined>;
//   params: { userId: string }; // ✅ Ensure `params` is an object, not a Promise
// };
export type SearchParamProps = {
  searchParams: { [key: string]: string | string[] | undefined };
  params: { userId: string };
};

export type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export type createPatientProps = {
  name: string;
  email: string;
  phone: string;
};

export type registerFormProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
};
export type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export type PatientState = {
  currentPatient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  loading: boolean;
  error: boolean;
};

export interface RootState {
  patient: PatientState;
}
type Appointment = {
  userId: string;
  schedule: Date;
  status: "pending" | "scheduled" | "cancelled";
  reason: string;
  notes: string;
  doctor: string;
  cancellationReason: string;
};

export type AppointmentProps = {
  type: "create" | "cancel" | "schedule";
  userId: string;
  patientId?: string;
  appointment?: Appointment; // ✅ Add this line
  setOpen?: Dispatch<SetStateAction<boolean>>; // ✅ Ensure setOpen is included
};

export type appointmentDataProps =
  | {
      cancellationReason: string;
      patientId: string;
      status: string;
    }
  | {
      doctor: string;
      notes?: string;
      reason: string;
      schedule: Date;
      patientId: string;
      status: string;
    };
export type createResponseProps = {
  success: boolean;
  data: Promise<any>;
  error?: undefined;
};
