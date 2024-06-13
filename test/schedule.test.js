import { DateTime } from 'luxon';
import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { OneOffSchedule, DailySchedule, WeeklySchedule } from '../src/schedule.js';

describe('OneOffSchedule', function () {
    it('should only fall on one particular day', function () {
        const schedule = new OneOffSchedule(DateTime.fromISO('2024-06-13T00:00:00Z'));
        const dates = [...schedule.simulate()];
        assert.equal(dates.length, 1);
        assert.equal(dates[0].toISODate(), '2024-06-13');
    });
});

describe('DailySchedule', function () {
    it('should run daily from start to finish', function () {
        const schedule = new DailySchedule(DateTime.fromISO('2024-06-13T00:00:00Z'), DateTime.fromISO('2024-06-15T00:00:00Z'));
        const dates = [...schedule.simulate()];
        assert.deepEqual(dates.map((date) => date.toISODate()), [ '2024-06-13', '2024-06-14', '2024-06-15' ]);
    });
    it('should run every 2 days', function () {
        const schedule = new DailySchedule(DateTime.fromISO('2024-06-13T00:00:00Z'), DateTime.fromISO('2024-06-19T00:00:00Z'), 2);
        const dates = [...schedule.simulate()];
        assert.deepEqual(dates.map((date) => date.toISODate()), [ '2024-06-13', '2024-06-15', '2024-06-17', '2024-06-19' ]);
    });
});

describe('WeeklySchedule', function() {
    it('should allow running on weekdays only', function () {
        const mondayToFriday = [ 1, 2, 3, 4, 5 ];
        const schedule = new WeeklySchedule(DateTime.fromISO('2024-06-10T00:00:00Z'), DateTime.fromISO('2024-06-24T00:00:00Z'), mondayToFriday);
        const dates = [...schedule.simulate()];
        assert.deepEqual(dates.map((date) => date.toISODate()), [
            '2024-06-10',
            '2024-06-11',
            '2024-06-12',
            '2024-06-13',
            '2024-06-14',
            // weekend
            '2024-06-17',
            '2024-06-18',
            '2024-06-19',
            '2024-06-20',
            '2024-06-21',
            // weekend
            '2024-06-24',
        ]);
    });
});
