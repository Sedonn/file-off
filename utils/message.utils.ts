import { ErrorMessage, ResultMessage } from '../@types/file-off';

/**
 * Function for standardization of response result messages.
 * @param {string} message - Result message text.
 * @returns {ResultMessage} - Result message object.
 */
export const createResultMessage = (message: string): ResultMessage => {
    const resultMessage: ResultMessage = { message };

    return resultMessage;
};

/**
 * Function for standardization of response error messages.
 * @param {Array<string> | string} message - Error message text.
 * @returns {ErrorMessage} - Error message object.
 */
export const createErrorMessage = (message: Array<string> | string): ErrorMessage => {
    const errorMessage: ErrorMessage = {
        error: typeof message === 'string' ? [message] : message,
    };

    return errorMessage;
};
