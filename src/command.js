import { DATABASE, ENV } from "./env.js";
import { addCount, resetCount } from "./counter.js";

const handlers = {
    打卡: (args) => {
        if (args.length > 0) {
            return addCount(args[0]);
        } else {
            return `不完整的命令`;
        }
    },

    重置打卡: (args) => {
        if (args.length > 0) {
            return resetCount(args[0]);
        } else {
            return `不完整的命令`;
        }
    },
    // ...其他命令处理函数
};

export async function handleCommand(text) {
    const parts = text.trim().split(" ");
    const command = parts[0];
    const args = parts.slice(1);
    //console.log(`Type command: ${typeof command}`)
    //console.log(`Type args: ${typeof args}, value ${args}, length ${args.length}`)
    if (handlers[command]) {
        return await handlers[command](args);
    } else {
        console.log("Unknown command");
        return `不能识别的命令`;
    }
}
