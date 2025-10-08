import React from "react";
import type { FormField } from "../types";
import type { FormTheme } from "../themes";

interface SelectFieldProps {
  fieldName: string;
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  theme: FormTheme;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  fieldName,
  field,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  theme,
}) => {
  const options = field.enum || [];
  const optionLabels = field.enumNames || options;

  return (
    <div className={theme.field.container}>
      <label className={theme.field.label}>
        {field.title || fieldName}
        {required && <span className={theme.field.requiredIndicator}>*</span>}
      </label>
      {field.description && (
        <p className={theme.field.description}>{field.description}</p>
      )}

      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${theme.select.base} ${
          error ? theme.select.error : theme.select.normal
        } ${disabled ? theme.select.disabled : ""}`}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {optionLabels[index] || option}
          </option>
        ))}
      </select>

      {error && <p className={theme.field.errorMessage}>{error}</p>}
    </div>
  );
};
