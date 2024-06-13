import Big from 'big.js';
import { scheduleFromJSON } from './schedule.js';

export class ScheduledOrder {
    #orderId;
    #customerId;
    #quantity;
    #schedule;

    constructor(orderId, customerId, quantity, schedule) {
        this.#orderId = orderId;
        this.#customerId = customerId;
        this.#quantity = quantity;
        this.#schedule = schedule;
    }

    getQuantityForDay(date) {
        const iter = this.#schedule.simulate(date);
        let result;
        do {
            result = iter.next();
            
        } while (!result.done && result.value < date);
        if (result.value && result.value.toMillis() === date.toMillis()) {
            return this.#quantity;
        } else {
            return new Big(0);
        }
    }

    getOrderId() {
        return this.#orderId;
    }

    getCustomerId() {
        return this.#customerId;
    }

    toJSON() {
        return { type: 'ScheduledOrder', orderId: this.#orderId, customerId: this.#customerId, quantity: Number(this.#quantity), schedule: this.#schedule.toJSON() };
    }

    static fromJSON(src) {
        return new ScheduledOrder(src.orderId, src.customerId, new Big(src.quantity), scheduleFromJSON(src.schedule));
    }
}
