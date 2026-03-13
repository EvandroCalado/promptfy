/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError, flattenError } from 'zod';

export type InitialFormState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  payload?: FormData;
};

export const formErrorHandler = (
  error: unknown,
  formData?: FormData,
): InitialFormState => {
  if (error instanceof ZodError) {
    return {
      success: false,
      message: undefined,
      fieldErrors: flattenError(error).fieldErrors,
      payload: formData,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      fieldErrors: undefined,
      payload: formData,
    };
  }

  let message: string;

  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof (error as any).message === 'string') {
    message = (error as any).message;
  } else {
    message = 'Algo deu errado';
  }

  return {
    success: false,
    message,
    fieldErrors: undefined,
    payload: formData,
  };
};
