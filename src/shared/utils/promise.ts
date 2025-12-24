import { captureException } from '@sentry/browser';

export const filterFulfilled = <T = unknown>(
  list: PromiseSettledResult<T>[],
) => {
  return list
    .filter((result): result is PromiseFulfilledResult<T> => {
      if (result.status === 'rejected') {
        captureException(new Error(result.reason));
      }
      return result.status === 'fulfilled';
    })
    .map((result) => result.value);
};
