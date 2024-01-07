/** @fileoverview Commonly used functions for the form data validation. */

export const createEmptyFieldValidationRule =
  (errorMessage: string) => (value: string) => {
    if (value) {
      return true;
    }

    return errorMessage;
  };

export const createEmptyFileFieldValidationRule =
  (errorMessage: string) => (value: File[]) => {
    if (value && value.length) {
      return true;
    }

    return errorMessage;
  };
