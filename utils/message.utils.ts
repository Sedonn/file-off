import { ErrorMessage, ResultMessage } from '../@types/file-off';

export const createResultMessage = (message: string) => {
    const resultMessage: ResultMessage = { message };

    return resultMessage;
};

export const createErrorMessage = (message: Array<string> | string) => {
    const errorMessage: ErrorMessage = {
        error: typeof message === 'string' ? [message] : message,
    };

    return errorMessage;
};
