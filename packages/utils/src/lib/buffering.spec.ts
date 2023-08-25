import { buffering } from './buffering';
import { vi } from 'vitest';

describe('buffering', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should buffer calls', () => {
    const fn = vi.fn();
    const batch = buffering(fn, { maxDebounce: 0, maxWait: 100 });

    batch(1);
    batch(2);
    batch(3);

    expect(fn).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith([[1], [2], [3]]);
  });

  it('should debounce calls', () => {
    const fn = vi.fn();
    const batch = buffering(fn, { maxDebounce: 10, maxWait: 100 });

    batch(1);
    batch(2);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5);

    batch(3);
    batch(4);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(5);

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(10);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith([[1], [2], [3], [4]]);
  });
});
