# telegram-counter

## How to start

### Clone the project to local

Or fork it...

### Prepare your secrets in .dev.vars

```
TG_BOT_TOKEN=
TG_CHAT_ID=
```
### wrangler environment

- Init wrangler environment follow instructions on cloudflare

### Local D1 Database

- Follow the instructions to init the instance under your account
- Update information in wrangler.toml
- Init using the scripts under src/database (locally first)

### Run in local environment

```
npx wrangler dev
```

### Connect with your Telegram Bot

You may need ngrok to proxy the traffic back to your local environment

```
To set the webhook mannually. Register from worker will be implemented in later phases.

https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}
```

## Deploy online

### Deploy D1 Database

```
npx wrangler d1 execute counter --file=./src/database/01_init.sql
```

### Deploy service

```
npx wrangler deploy
```