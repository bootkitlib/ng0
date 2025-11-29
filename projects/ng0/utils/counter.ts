
import { signal } from '@angular/core';
import { animationFrameScheduler, interval, map, Subscription, takeWhile } from 'rxjs';

/**
 * Easing function type definition.
 */
export type EasingFn = (t: number) => number;

/**
 * A counter that animates a numeric value from a start to an end value over a specified duration using an easing function.
 */
export class Counter {
  private _subscription?: Subscription;
  public readonly value = signal(0);
  public readonly running = signal(false);
  public readonly easing: EasingFn;

  constructor(
    public readonly from: number,
    public readonly to: number,
    public readonly duration = 1000,
    easing?: EasingFn,
    currentValue?: number) {

    if (to < from || duration <= 0) {
      throw new Error('Invalid params');
    }

    this.easing = easing ?? easingFunctions.linear;
    this.value.set(currentValue != null ? currentValue : this.from);
  }

  /**
   * Resets the counter and starts it.
   * This method should be called in a browser environment.
   * @returns void
   */
  public start() {
    if (this.running()) return;

    this.value.set(this.from);
    this.running.set(true);

    const startTime = performance.now();
    const from = this.from;
    const change = this.to - this.from;

    this._subscription = interval(0, animationFrameScheduler)
      .pipe(
        map(() => performance.now() - startTime),
        takeWhile(time => time <= this.duration, true),
        map(elapsed => {
          const t = Math.min(1, elapsed / this.duration);
          return from + change * this.easing(t);
        })
      )
      .subscribe({
        next: val => this.value.set(val),
        complete: () => {
          this.running.set(false)
        }
      });
  }

  /**
   * Stops the counter animation.
   */
  public stop() {
    this._subscription?.unsubscribe();
    this.running.set(false);
  }
}

/**
 * A collection of common easing functions for animations.
 */
export const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => t < 0.5 ? (2 * t * t) : (-1 + (4 - 2 * t) * t),
  smooth: (t: number) => t * t * (3 - 2 * t),
  // smoother: (t: number) => t * t * t * (t * (6 - 15 * t) + 10)
};