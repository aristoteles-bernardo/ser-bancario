


export interface FormTheme {
  // Form container styles
  form: {
    container: string;
    titleSection: string;
    title: string;
    description: string;
    fieldsContainer: string;
    buttonSection: string;
  };

  // Submit and reset button styles
  buttons: {
    submit: {
      base: string;
      disabled: string;
    };
    reset: {
      base: string;
      disabled: string;
    };
  };

  // Common field styles
  field: {
    container: string;
    label: string;
    requiredIndicator: string;
    description: string;
    errorMessage: string;
  };

  // Text/Email/Number input styles
  input: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
    placeholder?: string;
  };

  // Textarea styles
  textarea: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
  };

  // Select dropdown styles
  select: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
  };

  // Boolean checkbox styles
  booleanCheckbox: {
    container: string;
    input: string;
    label: string;
    description: string;
  };

  // Checkbox group styles (for multi-select)
  checkboxGroup: {
    container: string;
    optionContainer: string;
    optionLabel: string;
    checkbox: string;
  };

  // Date field styles
  dateInput: {
    base: string;
    normal: string;
    error: string;
    disabled: string;
  };

  // Unsupported field type warning
  unsupportedField: {
    container: string;
    message: string;
  };
}

export const defaultFormTheme: FormTheme = {
  form: {
    container: "space-y-6",
    titleSection: "border-b border-light-grey pb-4",
    title: "text-2xl font-bold text-dark-teal",
    description: "mt-1 text-sm text-medium-grey",
    fieldsContainer: "space-y-4",
    buttonSection: "flex space-x-4 pt-4 border-t border-light-grey",
  },

  buttons: {
    submit: {
      base: "inline-flex justify-center py-3 px-6 border border-transparent shadow-modern text-sm font-semibold rounded-md text-white bg-gold hover:bg-deep-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-smooth",
      disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
    },
    reset: {
      base: "inline-flex justify-center py-3 px-6 border border-light-grey shadow-modern text-sm font-medium rounded-md text-dark-grey bg-white hover:bg-warm-grey focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-teal transition-smooth",
      disabled: "disabled:opacity-50",
    },
  },

  field: {
    container: "mb-4",
    label: "block text-sm font-medium text-dark-grey mb-1",
    requiredIndicator: "text-alert-red ml-1",
    description: "text-sm text-medium-grey mb-1",
    errorMessage: "mt-1 text-sm text-alert-red",
  },

  input: {
    base: "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-deep-teal transition-smooth",
    normal: "border-light-grey",
    error: "border-alert-red",
    disabled: "bg-warm-grey cursor-not-allowed",
  },

  textarea: {
    base: "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-deep-teal resize-vertical transition-smooth",
    normal: "border-light-grey",
    error: "border-alert-red",
    disabled: "bg-warm-grey cursor-not-allowed resize-none",
  },

  select: {
    base: "block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-1 sm:text-sm",
    normal:
      "border-light-grey focus:border-deep-teal focus:ring-deep-teal bg-white text-dark-grey hover:border-medium-grey",
    error: "border-alert-red focus:border-alert-red focus:ring-alert-red",
    disabled: "bg-warm-grey text-medium-grey cursor-not-allowed",
  },

  booleanCheckbox: {
    container: "flex items-center",
    input:
      "mr-2 h-4 w-4 text-gold focus:ring-gold border-light-grey rounded",
    label: "text-sm font-medium text-dark-grey",
    description: "text-sm text-medium-grey mt-1 ml-6",
  },

  checkboxGroup: {
    container: "space-y-2",
    optionContainer: "flex items-center",
    optionLabel: "text-sm text-dark-grey",
    checkbox:
      "mr-2 h-4 w-4 text-gold focus:ring-gold border-light-grey rounded",
  },

  dateInput: {
    base: "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-deep-teal",
    normal: "border-light-grey",
    error: "border-alert-red",
    disabled: "bg-warm-grey cursor-not-allowed",
  },

  unsupportedField: {
    container: "mb-4 p-4 bg-light-gold border border-gold/30 rounded-md",
    message: "text-dark-grey",
  },
};

/**
 * Deep merges a partial theme with the default theme
 * @param partialTheme - Partial theme to merge with defaults
 * @returns Complete theme with overrides applied, preserving all default properties
 */
export function mergeTheme(partialTheme?: Partial<FormTheme>): FormTheme {
  if (!partialTheme) {
    return defaultFormTheme;
  }

  // Deep merge helper for nested objects
  const mergeNestedObject = <T extends Record<string, any>>(
    defaultObj: T,
    partialObj?: Partial<T>
  ): T => {
    if (!partialObj) return defaultObj;
    return { ...defaultObj, ...partialObj };
  };

  return {
    form: mergeNestedObject(defaultFormTheme.form, partialTheme.form),
    buttons: {
      submit: mergeNestedObject(
        defaultFormTheme.buttons.submit,
        partialTheme.buttons?.submit
      ),
      reset: mergeNestedObject(
        defaultFormTheme.buttons.reset,
        partialTheme.buttons?.reset
      ),
    },
    field: mergeNestedObject(defaultFormTheme.field, partialTheme.field),
    input: mergeNestedObject(defaultFormTheme.input, partialTheme.input),
    textarea: mergeNestedObject(
      defaultFormTheme.textarea,
      partialTheme.textarea
    ),
    select: mergeNestedObject(defaultFormTheme.select, partialTheme.select),
    booleanCheckbox: mergeNestedObject(
      defaultFormTheme.booleanCheckbox,
      partialTheme.booleanCheckbox
    ),
    checkboxGroup: mergeNestedObject(
      defaultFormTheme.checkboxGroup,
      partialTheme.checkboxGroup
    ),
    dateInput: mergeNestedObject(
      defaultFormTheme.dateInput,
      partialTheme.dateInput
    ),
    unsupportedField: mergeNestedObject(
      defaultFormTheme.unsupportedField,
      partialTheme.unsupportedField
    ),
  };
}



