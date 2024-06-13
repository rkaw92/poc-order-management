# Order Management app proof-of-concept

This repository demonstrates how to structure a simple application that calculates the ordered quantities for a given day, according to a set schedule.
It implements:
* A basic REST-like API
* A very simple domain model
* Local file persistence (crash-safe, concurrency-safe)

## Install and run
This project runs on Node.js. I recommend https://volta.sh/ to automatically download and run the correct Node version (20.x).

```
git clone https://github.com/rkaw92/poc-order-management.git
cd poc-order-management
npm install
npm start
```

If it works, you should see something like:
```
{"level":30,"time":1718320645266,"pid":82131,"hostname":"my-pc","msg":"Server listening at http://0.0.0.0:3000"}
```

Note: the application needs write access to the `data/` directory under the working directory (CWD).

## API

* `GET /orders` - list all added orders
* `POST /orders` - add a new order (see schema below)
* `GET /total/2024-06-14` - get orders scheduled for 14 June 2024, along with total quantity

### Order schema

In POST body, send a JSON object (Content-Type: application/json) like the following:

```json
{
    "customerId": "CUST-A",
    "orderId": "ORD-1",
    "quantity": "20",
    "schedule": {
        "type": "OneOffSchedule",
        "day": "2024-06-17"
    }
}
```

The example above creates a one-off (one-time delivery) order from customer CUST-A, for 20 pieces.

Note that `orderId` is always client-generated. If the ID already exists, the request fails.

### Schedule schema

In the schedule field, you can pass several types of schedules.

Single delivery only:
```json
{
    "type": "OneOffSchedule",
    "day": "2024-06-14"
}
```

Every-day delivery (incl. weekends) for 1 week ongoing:
```json
{
    "type": "DailySchedule",
    "start": "2024-06-17",
    "endInclusive": "2024-06-21",
    "step": 1
}
```
(for delivery every 2 days, set `"step": 2`, etc.)

Weekly schedule with day selection, Mon, Wed, Fri:
```json
{
    "type": "WeeklySchedule",
    "start": "2024-06-17",
    "endInclusive": "2024-06-28",
    "weekdays": [1, 3, 5]
}
```
(Note: Monday is 1, Sunday is 7.)

## License

This code is available under the terms of the MIT License. It is open-source and made for educational purposes.

It comes with absolutely no warranty.
