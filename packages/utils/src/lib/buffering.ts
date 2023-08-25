import { RingBuffer } from '../utils/RingBuffer';

type BufferingOptions = {
  maxSize: number;
  maxDebounce: number;
  maxWait: number;
};

const defaultOptions: BufferingOptions = {
  maxSize: 255,
  maxDebounce: 50,
  maxWait: 500,
};

type Buffering<TFunc extends (args: any[]) => any> = {
  /**
   * Enqueues a single item to be batched
   */
  (...args: Parameters<TFunc>[0][number]): void;
  /**
   * Enqueues multiple items to be batched
   */
  batch(items: Parameters<TFunc>[0]): void;
  /**
   * Cancels the current batch, discarding all items
   *
   * @remarks This will not dereference the values until overwritten
   */
  cancel(): void;

  /**
   * Flushes the current batch synchronously, returning the result of the underlying function
   */
  flush(): ReturnType<TFunc>;
};

/**
 * Creates a buffering function that will batch calls to the underlying function. The supplied callback will be called with an array of batched arguments.
 *
 * `buffering` will only batch up to a specified capacity. If that were to be exceeded, the buffer will be flushed synchronously and the above-capacity item will start a new batch.
 *
 * `buffering` will also flush the buffer after a specified debounce time, or after a specified maximum wait time, which can both be configured.
 *
 * @param fn The function to buffer calls to
 * @param options The options to configure the buffering
 * @returns A buffering function
 */
export const buffering = <TFunc extends (args: any[]) => any>(
  fn: TFunc,
  options: Partial<BufferingOptions> = {}
): Buffering<TFunc> => {
  const { maxSize, maxDebounce, maxWait } = { ...defaultOptions, ...options };
  const buffer = new RingBuffer<Parameters<TFunc>[0]>(maxSize + 1);

  let timeout: NodeJS.Timeout | undefined = undefined;
  let maxWaitTimeout: NodeJS.Timeout | undefined = undefined;

  const flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    if (maxWaitTimeout) {
      clearTimeout(maxWaitTimeout);
      maxWaitTimeout = undefined;
    }

    const items = buffer.flush();

    return fn(items);
  };

  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (maxWaitTimeout) {
      clearTimeout(maxWaitTimeout);
    }

    buffer.reset();
  };

  const cb = (...args: Parameters<TFunc>[0][number]) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (!buffer.enqueue(args)) {
      flush();
      buffer.enqueueUnchecked(args);
    }

    timeout = setTimeout(flush, maxDebounce);
    if (!maxWaitTimeout) {
      maxWaitTimeout = setTimeout(flush, maxWait);
    }
  };

  const batch = (...args: Parameters<TFunc>[0]) => {
    for (const arg of args) {
      cb(arg);
    }
  };

  cb.batch = batch;
  cb.cancel = cancel;
  cb.flush = flush;
  return cb;
};
