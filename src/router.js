import { DATABASE, ENV } from "./env.js";
import {
    bindTelegramWebHook,
    bindCommandForTelegram,
    sendMessage,
} from "./telegram.js";
import { renderHTML, errorToString } from "./utils.js";
import { handleCommand } from "./command.js";

const footer = `
<br/>
<p></p>
<p>If you have any questions, please visit nowhere to ask.</p>
`;

export async function handleRequest(request) {
    const { pathname } = new URL(request.url);
    if (pathname === `/`) {
        return defaultIndexAction();
    }
    if (pathname.startsWith(`/init`)) {
        return bindWebHookAction(request);
    }
    if (pathname.startsWith(`/tg`)) {
        return handleTelegramAction(request);
    }

    return null;
}

async function handleTelegramAction(request) {
    const body = await request.json();
    const text = body.message.text;
    console.log(`Text Message recieved: ${text}`);

    const msg = await handleCommand(text);
    console.log(`Message sent: ${msg}`);
    await sendMessage(msg, ENV.TG_CHAT_ID, ENV.TG_BOT_TOKEN);

    return new Response({
        status: 200,
    });
}

async function bindWebHookAction(request) {
    const result = [];
    const domain = new URL(request.url).host;

    const url = `https://${domain}/tg`;
    result[0] = {
        //webhook: await bindTelegramWebHook(ENV.TG_BOT_TOKEN, url).catch((e) => errorToString(e)),
        command: await bindCommandForTelegram(ENV.TG_BOT_TOKEN).catch((e) =>
            errorToString(e)
        ),
    };

    const HTML = renderHTML(`
      <h1>Telegram-Counter</h1>
      <h2>${domain}</h2>
      <p>Init Successfully!</p>
      
        ${footer}
      `);
    return new Response(HTML, {
        status: 200,
        headers: { "Content-Type": "text/html" },
    });
}

async function defaultIndexAction() {
    const HTML = renderHTML(`
      <h1>Telegram-Counter</h1>
      <br/>
      <p>Deployed Successfully!</p>
      <br/>
      <br/>
      ${footer}
    `);
    return new Response(HTML, {
        status: 200,
        headers: { "Content-Type": "text/html" },
    });
}
