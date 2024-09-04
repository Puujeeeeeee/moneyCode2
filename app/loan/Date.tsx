class CustomDateTime {
  static monday = 1;
  static tuesday = 2;
  static wednesday = 3;
  static thursday = 4;
  static friday = 5;
  static saturday = 6;
  static sunday = 7;
  static daysPerWeek = 7;
  static january = 0; // JavaScript months are 0-based
  static february = 1;
  static march = 2;
  static april = 3;
  static may = 4;
  static june = 5;
  static july = 6;
  static august = 7;
  static september = 8;
  static october = 9;
  static november = 10;
  static december = 11;
  static monthsPerYear = 12;
  date: any;
  isUtc: any;

  constructor(year, month = 0, day = 1, hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, isUtc = false) {
    this.isUtc = isUtc;
    if (isUtc) {
      this.date = new Date(Date.UTC(year, month, day, hour, minute, second, millisecond + Math.floor(microsecond / 1000)));
    } else {
      this.date = new Date(year, month, day, hour, minute, second, millisecond + Math.floor(microsecond / 1000));
    }
  }

  static now() {
    return new CustomDateTime(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), new Date().getMilliseconds());
  }

  static utcNow() {
    return new CustomDateTime(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), new Date().getUTCHours(), new Date().getUTCMinutes(), new Date().getUTCSeconds(), new Date().getUTCMilliseconds(), 0, true);
  }

  static parse(formattedString) {
    const date = new Date(formattedString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return new CustomDateTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  static tryParse(formattedString) {
    try {
      return CustomDateTime.parse(formattedString);
    } catch (e) {
      return null;
    }
  }

  static fromMillisecondsSinceEpoch(millisecondsSinceEpoch, isUtc = false) {
    const date = new Date(millisecondsSinceEpoch);
    return new CustomDateTime(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds(), 0, isUtc);
  }

  static fromMicrosecondsSinceEpoch(microsecondsSinceEpoch, isUtc = false) {
    const millisecondsSinceEpoch = Math.floor(microsecondsSinceEpoch / 1000);
    return CustomDateTime.fromMillisecondsSinceEpoch(millisecondsSinceEpoch, isUtc);
  }

  add(duration) {
    return new CustomDateTime(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() + duration.days, this.date.getHours() + duration.hours, this.date.getMinutes() + duration.minutes, this.date.getSeconds() + duration.seconds, this.date.getMilliseconds() + duration.milliseconds);
  }

  subtract(duration) {
    return new CustomDateTime(this.date.getFullYear(), this.date.getMonth(), this.date.getDate() - duration.days, this.date.getHours() - duration.hours, this.date.getMinutes() - duration.minutes, this.date.getSeconds() - duration.seconds, this.date.getMilliseconds() - duration.milliseconds);
  }

  difference(other) {
    const diff = this.date - other.date;
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      milliseconds: Math.floor(diff % 1000)
    };
  }

  toLocal() {
    return new CustomDateTime(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), this.date.getHours(), this.date.getMinutes(), this.date.getSeconds(), this.date.getMilliseconds(), 0, false);
  }

  toUtc() {
    return new CustomDateTime(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate(), this.date.getUTCHours(), this.date.getUTCMinutes(), this.date.getUTCSeconds(), this.date.getUTCMilliseconds(), 0, true);
  }

  isBefore(other) {
    return this.date < other.date;
  }

  isAfter(other) {
    return this.date > other.date;
  }

  isAtSameMomentAs(other) {
    return this.date.getTime() === other.date.getTime();
  }

  compareTo(other) {
    return this.date.getTime() - other.date.getTime();
  }

  toString() {
    return this.date.toISOString();
  }

  toIso8601String() {
    return this.date.toISOString();
  }

  get year() {
    return this.isUtc ? this.date.getUTCFullYear() : this.date.getFullYear();
  }

  get month() {
    return this.isUtc ? this.date.getUTCMonth() + 1 : this.date.getMonth() + 1; // JavaScript months are 0-based
  }

  get day() {
    return this.isUtc ? this.date.getUTCDate() : this.date.getDate();
  }

  get hour() {
    return this.isUtc ? this.date.getUTCHours() : this.date.getHours();
  }

  get minute() {
    return this.isUtc ? this.date.getUTCMinutes() : this.date.getMinutes();
  }

  get second() {
    return this.isUtc ? this.date.getUTCSeconds() : this.date.getSeconds();
  }

  get millisecond() {
    return this.isUtc ? this.date.getUTCMilliseconds() : this.date.getMilliseconds();
  }

  get weekday() {
    return this.isUtc ? this.date.getUTCDay() : this.date.getDay(); // JavaScript days are 0-based (0 = Sunday)
  }

  get millisecondsSinceEpoch() {
    return this.date.getTime();
  }

  get microsecondsSinceEpoch() {
    return this.date.getTime() * 1000;
  }

  get timeZoneName() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  get timeZoneOffset() {
    return this.date.getTimezoneOffset();
  }

  copyWith({ year, month, day, hour, minute, second, millisecond, microsecond, isUtc }) {
    return new CustomDateTime(
      year ?? this.year,
      month ?? this.month - 1, // JavaScript months are 0-based
      day ?? this.day,
      hour ?? this.hour,
      minute ?? this.minute,
      second ?? this.second,
      millisecond ?? this.millisecond,
      microsecond ?? this.microsecond,
      isUtc ?? this.isUtc
    );
  }
}

// Example usage:
const now = CustomDateTime.now();
console.log(now.toString());

const specificDate = new CustomDateTime(2023, 7, 1, 12, 0, 0, 0, 0, true);
console.log(specificDate.toString());

const parsedDate = CustomDateTime.parse("2023-07-01T12:00:00.000Z");
console.log(parsedDate.toString());

const addedDate = now.add({ days: 10, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
console.log(addedDate.toString());
