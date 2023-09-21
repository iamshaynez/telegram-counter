import { DATABASE, ENV } from "./env.js";
import { bindTelegramWebHook, sendMessage } from "./telegram.js";
import { renderHTML, errorToString, assistantMessage } from "./utils.js";
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
    //console.log(`Message sent: ${msg}`);
    await sendMessage(assistantMessage(msg), ENV.TG_CHAT_ID, ENV.TG_BOT_TOKEN);

    return new Response({
        status: 200,
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
