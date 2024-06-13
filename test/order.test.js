import Big from 'big.js';
import { DateTime } from 'luxon';
import * as assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ScheduledOrder } from '../src/order.js';
import { DailySchedule } from '../src/schedule.js';

describe('ScheduledOrder', function () {
    it('should determine quantity for first day of delivery', function () {
        const order = new ScheduledOrder(
            'customer-a',
            new Big(10),
            new DailySchedule(
                DateTime.fromISO('2024-06-13T00:00:00Z'),
                DateTime.fromISO('2024-06-20T00:00:00Z')
            )
        );
        const quantity = order.getQuantityForDay(DateTime.fromISO('2024-06-13T00:00:00Z'));
        assert.equal(Number(quantity), 10);
    });
});
