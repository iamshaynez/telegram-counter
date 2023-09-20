import { DATABASE, ENV } from "./env.js";

// send text message to telegram
export async function sendMessage(text, chat_id, bot_token) {
  return await fetch(`${ENV.TELEGRAM_API_DOMAIN}/bot${bot_token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      method: "post",
      text: text,
      chat_id: chat_id,
    }),
  });
}

// bind webhook for bot
export async function bindTelegramWebHook(token, url) {
  return await fetch(`${ENV.TELEGRAM_API_DOMAIN}/bot${token}/setWebhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
    }),
  }).then((res) => res.json());
}

// commands
const commands = [
  { command: "count", description: "打卡计数" },
  { command: "reset", description: "重置计数" },
  { command: "show", description: "查询历史" },
];

// bind commands for bot
export async function bindCommandForTelegram(token) {
  return await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commands: commands,
    }),
  }).then((res) => res.json());
}
