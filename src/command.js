import { DATABASE, ENV } from "./env.js";
import {
    commandAddCount,
    commandResetCount,
    commandSetGoal,
    commandShowCountHistory,
    deleteCount,
    showCurrentCount,
} from "./counter.js";

const handlers = {
    打卡: (args) => {
        if (args.length > 1) {
            return commandAddCount(args[0], args[1]);
        } else if (args.length > 0) {
            return commandAddCount(args[0], "");
        } else {
            return `不完整的命令`;
        }
    },

    重置打卡: (args) => {
        if (args.length > 0) {
            return commandResetCount(args[0]);
        } else {
            return `不完整的命令`;
        }
    },

    删除打卡: (args) => {
        if (args.length > 0) {
            return deleteCount(args[0]);
        } else {
            return `不完整的命令`;
        }
    },

    查询打卡: (args) => {
        if (args.length > 0) {
            return showCurrentCount(args[0]);
        } else {
            return `不完整的命令`;
        }
    },
    设置打卡目标: (args) => {
        if (args.length > 2) {
            return commandSetGoal(args[0], args[1], args[2]);
        } else {
            return `不完整的命令`;
        }
    },
    查询打卡历史: (args) => {
        if (args.length > 0) {
            return commandShowCountHistory(args[0], 30);
        } else {
            return `不完整的命令`;
        }
    },
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
