import { DATABASE, ENV } from "./env.js";
import { bindTelegramWebHook, bindCommandForTelegram } from "./telegram.js";
import { renderHTML, errorToString } from "./utils.js";

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
    return 
  }
  
  return null;
}

async function handleTelegramAction(request) {
    

    return new Response(HTML, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
}

async function bindWebHookAction(request) {
  const result = [];
  const domain = new URL(request.url).host;

  const url = `https://${domain}/telegram`;
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
