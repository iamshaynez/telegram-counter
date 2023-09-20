import { initEnv } from "./src/env.js";
import { handleRequest } from "./src/router.js";
import { errorToString } from "./src/utils.js";


export default {
  async fetch(request, env) {
    try {
      initEnv(env);
      const body = await request.json();
      const { pathname } = new URL(request.url);
      console.log(pathname)
      console.log(body)
      const text = body.message.text;
      console.log(text)
      return new Response("OK", {status:200})
      //const resp = await handleRequest(request);
      //return resp || new Response("NOTFOUND", { status: 404 });
    } catch (e) {
      console.error(e);
      return new Response(errorToString(e), { status: 500 });
    }
  },
};
