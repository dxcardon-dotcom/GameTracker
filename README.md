# GameTracker Backend Starter

This is the small Node server your React app calls here:

```js
fetch("http://localhost:4000/create-checkout")
```

## Setup

1. Copy `.env.example` to `.env`.
2. Put your Stripe secret key in `STRIPE_SECRET_KEY`.
3. Put your Stripe recurring Price ID in `STRIPE_PRICE_ID`.
4. Put your Stripe webhook signing secret in `STRIPE_WEBHOOK_SECRET`.
5. Put your Firebase Admin service account JSON path in `FIREBASE_SERVICE_ACCOUNT_PATH`.
6. Run `npm start`.

Then test this URL in your browser:

```txt
http://localhost:4000/health
```

You should see:

```json
{ "ok": true }
```

Important: do not put your Stripe secret key in your React app.
