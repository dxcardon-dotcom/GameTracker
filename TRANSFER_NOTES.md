# GameTracker Transfer Notes

This folder contains the backend helper server and React frontend we built for GameTracker.

## Included files

- `server.js` - local Node backend for Stripe Checkout
- `package.json` - scripts for running the backend
- `.env.example` - template for local environment values
- `README.md` - setup instructions
- `frontend/` - React app recreated from the code pasted in chat

## Not included

- `.env` is intentionally not included in the transfer archive because it contains private Stripe values.
- Your real `.env` values need to be recreated on the new laptop.

## On the new laptop

1. Install Node.js from <https://nodejs.org>.
2. Copy `.env.example` to `.env`.
3. Fill in:

```txt
PORT=4000
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

4. Run the backend from this folder:

```bash
node server.js
```

5. Visit:

```txt
http://localhost:4000/health
```

You should see:

```json
{"ok":true}
```

## Run the React app

Open a second terminal, go into the `frontend` folder, then run:

```bash
npm install
npm run dev
```

The React app should open on a local URL, usually:

```txt
http://localhost:5173
```

If your React app uses a different port than `5173`, update `CLIENT_URL` in `.env`
to match the frontend URL.

## Stripe webhook

The React app no longer upgrades users to Pro from a success URL. The backend verifies
Stripe webhook signatures at `/stripe-webhook`, then updates the user's Firestore plan
after Stripe confirms checkout.

For local testing, run Stripe CLI in another terminal:

```bash
stripe listen --forward-to localhost:4000/stripe-webhook
```

Copy the `whsec_...` value it prints into `STRIPE_WEBHOOK_SECRET`.
