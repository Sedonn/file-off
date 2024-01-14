/** @fileoverview Common functions for the form data validation. */

/**
 * Create a method that verifies a empty string fields with a certain error message.
 * @param errorMessage
 */
export const createEmptyFieldValidationRule =
  (errorMessage: string) => (value: string) => {
    if (value) {
      return true;
    }

    return errorMessage;
  };

/**
 * Create a method that verifies a empty file fields with a certain error message.
 * @param errorMessage
 */
export const createEmptyFileFieldValidationRule =
  (errorMessage: string) => (value: File[]) => {
    if (value && value.length) {
      return true;
    }

    return errorMessage;
  };
