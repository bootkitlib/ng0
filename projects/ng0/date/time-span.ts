const f = Math.floor;

/**
 * Represents a time span in months, days, hours, minutes, seconds, and milliseconds.
 * Provides methods to create a TimeSpan from a total number of milliseconds.
 * @example
 * const span = TimeSpan.fromMilliseconds(123456789);
 * console.log(span); // TimeSpan { months: 0, days: 1, hours: 10, minutes: 17, seconds: 36, milliseconds: 789 }
 */
export class TimeSpan {
  /** Milliseconds per second */
  public static readonly msPerSecond = 1000;

  /** Milliseconds per minute */
  public static readonly msPerMinute = this.msPerSecond * 60;

  /** Milliseconds per hour */
  public static readonly msPerHour = this.msPerMinute * 60;

  /** Milliseconds per day */
  public static readonly msPerDay = this.msPerHour * 24;

  /** Milliseconds per month */
  public static readonly msPerMonth = this.msPerDay * 30;

  constructor(
    public readonly months: number = 0,
    public readonly days: number = 0,
    public readonly hours: number = 0,
    public readonly minutes: number = 0,
    public readonly seconds: number = 0,
    public readonly milliseconds: number = 0) {
  }

  /**
   * Creates a TimeSpan from a total number of milliseconds.
   * @param ms The total number of milliseconds.
   * @returns A TimeSpan representing the equivalent time span.
   */
  static fromMilliseconds(ms: number): TimeSpan {
    const months = f(ms / TimeSpan.msPerMonth),
      days = f((ms % TimeSpan.msPerMonth) / TimeSpan.msPerDay),
      hours = f((ms % TimeSpan.msPerDay) / TimeSpan.msPerHour),
      minutes = f((ms % TimeSpan.msPerHour) / TimeSpan.msPerMinute),
      seconds = f((ms % TimeSpan.msPerMinute) / TimeSpan.msPerSecond),
      milliseconds = (ms % TimeSpan.msPerSecond);
    return new TimeSpan(months, days, hours, minutes, seconds, milliseconds);
  }
}
