import { initEnv } from "./src/env.js";
import { handleRequest } from "./src/router.js";
import { errorToString } from "./src/utils.js";

export default {
    async fetch(request, env) {
        try {
            initEnv(env);

            //return new Response("OK", {status:200})
            const resp = await handleRequest(request);
            return resp || new Response("NOTFOUND", { status: 404 });
        } catch (e) {
            console.error(e);
            return new Response(errorToString(e), { status: 500 });
        }
    },
};
