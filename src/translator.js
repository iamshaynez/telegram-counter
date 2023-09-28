import { AI } from "./env.js";
import { Ai } from '@cloudflare/ai'

export async function translate(sentence, from = "chinese", to = "english") {
    const ai = new Ai(AI);
    const response = await ai.run('@cf/meta/m2m100-1.2b', {
        text: sentence,
        source_lang: from, // defaults to english
        target_lang: to 
      }
    );
    return response["translated_text"];
}