import { ScheduledOrder } from './order.js';
import { readFile, writeFile, rename } from 'node:fs/promises';
import queue from 'p-queue';

export class Orders {
    #writeQueue = new queue(1);
    #store = new Map();
    #dbPath;

    constructor(dbPath) {
        this.#dbPath = dbPath;
    }

    async init() {
        this.#store = await this.#load();
    }

    async #load() {
        let fileContents;
        try {
            fileContents = await readFile(this.#dbPath, { encoding: 'utf-8' });
        } catch (err) {
            if (err.code === 'ENOENT') {
                fileContents = '[]';
            } else {
                throw err;
            }
        }
        const POJSOs = JSON.parse(fileContents);
        return new Map(POJSOs.map((order) => [ order.orderId, ScheduledOrder.fromJSON(order) ]));
    }

    async #save() {
        const tmpPath = `${this.dbPath}.tmp${Date.now()}`;
        await this.#writeQueue.add(async () => {
            await writeFile(tmpPath, JSON.stringify([...this.#store.values()]), { encoding: 'utf-8' });
            await rename(tmpPath, this.#dbPath);
        });
    }

    async add(order) {
        if (this.#store.has(order.getOrderId())) {
            throw new Error('An order with this ID already exists');
        }
        this.#store.set(order.getOrderId(), order);
        await this.#save();
    }

    async getAll() {
        return [...this.#store.values()];
    }
}
