/**
 * A ring buffer is a fixed-size buffer that overwrites the oldest values when full. Employs FIFO (first in, first out) semantics.
 */
export class RingBuffer<T> {
  private buffer: T[];
  private tail = 0;
  private head = 0;

  /**
   * Creates a new ring buffer
   *
   * @param size The size of the buffer
   */
  constructor(private size: number) {
    this.buffer = Array.from({ length: size });
  }

  /**
   * Enqueues a value into the buffer, overwriting the oldest value if full.
   * Does not check if the buffer is full, use `enqueue` instead.
   *
   * @see {@link enqueue}
   *
   * @param value The value to enqueue
   * @returns `true` if the value was enqueued, this should always be the case
   */
  public enqueueUnchecked(value: T) {
    this.buffer[this.head] = value;
    this.head = (this.head + 1) % this.size;
    return true;
  }

  /**
   * Enqueues a value into the buffer, does not overwrite if full.
   *
   * @param value The value to enqueue
   * @returns `true` if the value was enqueued, `false` if the buffer was full
   */
  public enqueue(value: T) {
    if ((this.head + 1) % this.size === this.tail) {
      return false;
    }
    return this.enqueueUnchecked(value);
  }

  /**
   * Dequeues a value from the buffer, does not check empty or potentially stale values. Might return `undefined` if the buffer is empty and has not been written to yet. Use `dequeue` instead.
   *
   * @see {@link dequeue}
   *
   * @returns The dequeued value
   */
  public dequeueUnchecked() {
    const value = this.buffer[this.tail] as T;
    this.tail = (this.tail + 1) % this.size;
    return value;
  }

  /**
   * Dequeues a value from the buffer, returns `undefined` if empty.
   *
   * @returns The dequeued value, or `undefined` if empty
   */
  public dequeue() {
    if (this.head === this.tail) {
      return undefined;
    }
    return this.dequeueUnchecked();
  }

  /**
   * Dequeues values from the buffer until empty. Relies on a consistent internal state.
   *
   * @returns All values in the buffer, in order from oldest to newest
   */
  public flush() {
    const values = [];
    while (this.head !== this.tail) {
      values.push(this.dequeueUnchecked());
    }
    return values;
  }

  /**
   * Resets buffer indices to initial state. Effectively empties the buffer. Does not dereference values! If you wish to extract the values, use `flush` instead.
   *
   * @see {@link flush}
   */
  public reset() {
    this.tail = 0;
    this.head = 0;
  }
}
