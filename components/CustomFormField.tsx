"use client";
/* eslint-disable react/no-children-prop */
import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import "react-datepicker/dist/react-datepicker.css";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomProps, FormFieldType, RenderFieldProps } from "@/types";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { GenderOptions } from "@/constants";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import FileUploader from "./FileUploader";
import { Checkbox } from "./ui/checkbox";

const RenderField = ({
  field,
  value,
  fieldType,
  iconSrc,
  iconAlt,
  placeholder,
  name,
  showTimeSelect,
  disabled,
  subCategory,
  children,
  label,
}: RenderFieldProps) => {
  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              name={name}
              autoComplete="off"
              {...field}
              className="shad-input border-0"
              disabled={disabled}
            />
          </FormControl>
        </div>
      );
      break;
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={value || field.view}
            onChange={field.onChange}
            className="input-phone"
            disabled={disabled}
            autoComplete="off"
          />
        </FormControl>
      );
      break;
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={
                showTimeSelect ? "MM/dd/yyyy - h:mm aa" : "MM/dd/yyyy"
              } // Include date and time format
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
              autoComplete="off"
            />
          </FormControl>
        </div>
      );
      break;
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            autoComplete="off"
          >
            <FormControl className="">
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {children} {/* Nest the children here */}
            </SelectContent>
          </Select>
        </FormControl>
      );
      break;
    case FormFieldType.SKELETON:
      if (subCategory === "radio") {
        return (
          <FormControl>
            <RadioGroup
              className="flex h-11 gap-6 xl:justify-between"
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              {GenderOptions.map((option, i) => (
                <div key={option + i} className="radio-group">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        );
      } else if (subCategory === "fileSelector") {
        return (
          <FormControl>
            <FileUploader
              files={field.value || []} // Ensure it defaults to an empty array
              onChange={(newFiles) => field.onChange(newFiles)}
            />
          </FormControl>
        );
      }
      break;
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={disabled}
            autoComplete="off"
          />
        </FormControl>
      );
      break;
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={name} className="checkbox-label">
              {label}
            </label>
          </div>
        </FormControl>
      );
      break;
    default:
      break;
  }
};

const CustomFormField = ({
  control,
  fieldType,
  name,
  placeholder,
  label,
  iconSrc,
  iconAlt,
  children,
  disabled,
  subCategory,
  value,
  showTimeSelect,
}: CustomProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField
            field={field}
            value={value}
            fieldType={fieldType}
            iconSrc={iconSrc}
            placeholder={placeholder}
            name={name}
            iconAlt={iconAlt}
            control={control}
            children={children}
            disabled={disabled}
            subCategory={subCategory}
            label={label}
            showTimeSelect={showTimeSelect}
          />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
