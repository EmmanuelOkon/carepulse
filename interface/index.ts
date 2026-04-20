import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

export interface CustomFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (
    field: ControllerRenderProps<TFieldValues, TName>,
  ) => React.ReactNode;
  fieldType: FormFieldType;
}

export interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface FileUploaderProps {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
}
