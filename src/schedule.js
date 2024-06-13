import { DateTime } from 'luxon';

export class OneOffSchedule {
    #day;

    constructor(day) {
        this.#day = day;
    }

    *simulate(start = this.#day) {
        if (start.toMillis() === this.#day.toMillis()) {
            yield this.#day;
        }
    }

    toJSON() {
        return { type: 'OneOffSchedule', day: this.#day.toISODate() };
    }

    static fromJSON(src) {
        return new this(DateTime.fromISO(src.day, { zone: 'utc' }));
    }
}

export class DailySchedule {
    #start;
    #endInclusive;
    #step;

    constructor(start, endInclusive, step = 1) {
        this.#start = start;
        this.#endInclusive = endInclusive;
        this.#step = step;
    }

    *simulate(start = this.#start) {
        let now = start < this.#start ? this.#start : start;
        while (now <= this.#endInclusive) {
            yield now;
            now = now.plus({ days: this.#step });
        }
    }

    toJSON() {
        return { type: 'DailySchedule', start: this.#start.toISODate(), endInclusive: this.#endInclusive.toISODate(), step: this.#step };
    }

    static fromJSON(src) {
        return new this(
            DateTime.fromISO(src.start, { zone: 'utc' }),
            DateTime.fromISO(src.endInclusive, { zone: 'utc' }),
            src.step
        );
    }
}

export class WeeklySchedule {
    #start;
    #endInclusive;
    #weekdays;

    constructor(start, endInclusive, weekdays) {
        this.#start = start;
        this.#endInclusive = endInclusive;
        this.#weekdays = new Set(weekdays);
    }

    *simulate(start = this.#start) {
        let now = start < this.#start ? this.#start : start;
        while (now <= this.#endInclusive) {
            if (this.#weekdays.has(now.weekday)) {
                yield now;
            }
            now = now.plus({ days: 1 });
        }
    }

    toJSON() {
        return { type: 'WeeklySchedule', start: this.#start.toISODate(), endInclusive: this.#endInclusive.toISODate(), weekdays: Array.from(this.#weekdays) };
    }

    static fromJSON(src) {
        return new this(
            DateTime.fromISO(src.start, { zone: 'utc' }),
            DateTime.fromISO(src.endInclusive, { zone: 'utc' }),
            src.weekdays
        );
    }
}

export function scheduleFromJSON(src) {
    switch (src.type) {
        case 'OneOffSchedule':
            return OneOffSchedule.fromJSON(src);
        case 'DailySchedule':
            return DailySchedule.fromJSON(src);
        case 'WeeklySchedule':
            return WeeklySchedule.fromJSON(src);
        default:
            throw new Error(`Unsupported schedule type ${src.type}`);
    }
}
