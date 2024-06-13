import Big from 'big.js';
import fastify from 'fastify';
import { DateTime } from 'luxon';
import { env } from './env.js';
import { ScheduledOrder } from './order.js';
import { Orders } from './persistence.js';

const app = fastify({
    logger: true
});

const db = new Orders('data/orders.json');
await db.init();

app.get('/', async function (req, reply) {
    reply.send('Hello, world!');
});

app.get('/orders', async function (req, reply) {
    reply.send(await db.getAll());
});

app.post('/orders', async function (req, reply) {
    const order = ScheduledOrder.fromJSON(req.body);
    await db.add(order);
    reply.status(200).send({ ok: true });
});

app.get('/total/:date', async function (req, reply) {
    const date = DateTime.fromISO(req.params.date, { zone: 'utc' });
    const allOrders = await db.getAll();
    const matchingOrders = [];
    for (const order of allOrders) {
        const quantity = order.getQuantityForDay(date);
        if (quantity.gt(0)) {
            matchingOrders.push({ order, quantity });
        }
    }
    return {
        orders: matchingOrders,
        totalQuantity: matchingOrders.reduce((sum, { quantity }) => sum.plus(quantity), new Big(0)).toFixed()
    };
});

app.listen({
    host: env('HOST', '0.0.0.0'),
    port: Number(env('PORT', '3000'))
});
