import { ApiErrorResponse } from 'common';

export const isApiError = (error: unknown): error is ApiErrorResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('data' in error || 'error' in error) &&
    'status' in error
  );
};

export const getErrorMessage = (error: unknown): string | null => {
  let errorMessage = '';
  if (!error || !isApiError(error)) {
    return null;
  }

  switch (error.status) {
    case 466:
      errorMessage = 'Исчерпано кол-во использований метода, попробуйте пересоздать instance.';
      break;

    case 429:
      errorMessage = 'Слишком много запросов';
      break;

    case 'FETCH_ERROR':
      errorMessage = 'Проверьте правильность введенных данных';
      break;

    default:
      errorMessage = 'Что-то пошло не так, попробуйте еще раз.';
  }

  return errorMessage;
};

export const getNumber = (sender: string) => sender.slice(0, sender.indexOf('@'));

export const formatTimerValue = (value: number) => {
  const hours = Math.floor(value / 3600000);
  const minutes = Math.floor((value % 3600000) / 60000);
  const seconds = Math.floor((value % 60000) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// for css video layout
export function generateCssLayout(clientsNumber = 1) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pairs = (Array.from({ length: clientsNumber }) as any[][]).reduce(
    (acc, next, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }

      return acc;
    },
    []
  );

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs
    .map((row, index, arr) => {
      if (index === arr.length - 1 && row.length === 1) {
        return [
          {
            width: '100%',
            height,
          },
        ];
      }

      return row.map(() => ({
        width: '50%',
        // height,
      }));
    })
    .flat();
}

// for inactive tab timers
export class WorkerInterval {
  private readonly worker: Worker;
  constructor(callback: () => void, interval: number) {
    const blob = new Blob([`setInterval(() => postMessage(0), ${interval});`]);
    const workerScript = URL.createObjectURL(blob);
    this.worker = new Worker(workerScript);
    this.worker.onmessage = callback;
  }

  stop() {
    this.worker.terminate();
  }
}
