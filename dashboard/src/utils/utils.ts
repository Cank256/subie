import type { ApiError } from "@/client"

export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Invalid email address",
}

export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
  message: "Invalid name",
}

// Define types for form validation rules
type ValidationRule = {
  value?: number;
  message?: string;
}

type ValidationRules = {
  [key: string]: ValidationRule | string | ((value: string) => boolean | string);
}

type FormValues = {
  password?: string;
  new_password?: string;
  [key: string]: unknown;
}

type ToastFunction = (options: { title: string; description: string; variant: string }) => void;

export const passwordRules = (isRequired = true) => {
  const rules: ValidationRules = {
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
  }

  if (isRequired) {
    rules.required = "Password is required"
  }

  return rules
}

export const termsRules = (agreeTerms = false) => {
  if (!agreeTerms) {
    return; // Form validation will prevent submission
  }
}

export const confirmPasswordRules = (
  getValues: () => FormValues,
  isRequired = true,
) => {
  const rules: ValidationRules = {
    validate: (value: string) => {
      const password = getValues().password || getValues().new_password
      return value === password ? true : "The passwords do not match"
    },
  }

  if (isRequired) {
    rules.required = "Password confirmation is required"
  }

  return rules
}

export const handleError = (err: ApiError, toast: ToastFunction) => {
  const errDetail = (err.body as { detail?: string | Array<{ msg: string }> })?.detail
  let errorMessage = typeof errDetail === 'string' ? errDetail : "Something went wrong."
  if (Array.isArray(errDetail) && errDetail.length > 0) {
    errorMessage = errDetail[0].msg
  }
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  })
}

export const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = window.document.documentElement;
  
  // Remove previous theme classes
  root.classList.remove('light', 'dark');
  
  // Apply the theme
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

