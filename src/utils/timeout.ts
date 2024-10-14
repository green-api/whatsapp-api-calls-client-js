export class TimeoutError extends Error {}

export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_resolve, reject) => {
    setTimeout(() => reject(new TimeoutError()), ms);
  })

  return Promise.race([promise, timeoutPromise])
}