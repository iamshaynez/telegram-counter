import { DATABASE, ENV } from "./env.js";
import { errorToString } from "./utils.js";


export async function commandAddCount(name) {
    let messages = []
    messages.push(await addCount(name))
    messages.push(await showCurrentCount(name))
    return messages.join('\n')
}

export async function commandResetCount(name) {
    let messages = []
    messages.push(await resetCount(name))
    messages.push(await showCurrentCount(name))
    return messages.join('\n')
}

async function addCount(name) {
    try {
        const info = await DATABASE.prepare(
            "INSERT INTO count_log (count_name, count_type, count_value, count_date) VALUES (?1, 'count', 1, date('now'))"
        )
            .bind(name)
            .run();
        //console.log(info)

        return `${name} 打卡成功 `;
    } catch (error) {
        console.log(errorToString(error));
        return `${name} 打卡失败 ${errorToString(error)}`;
    }
}

async function resetCount(name) {
    try {
        const info = await DATABASE.prepare(
            "INSERT INTO count_log (count_name, count_type, count_value, count_date) VALUES (?1, 'reset', 1, date('now'))"
        )
            .bind(name)
            .run();

        //console.log(info)
        return `${name} 打卡重置成功 `;
    } catch (error) {
        //console.log(errorToString(error));
        return `${name} 打卡重置失败 ${errorToString(error)}`;
    }
}

export async function deleteCount(name) {
    try {
        const info = await DATABASE.prepare(
            "DELETE FROM count_log WHERE count_name=?1"
        )
            .bind(name)
            .run();

        //console.log(info)
        return `${name} 删除打卡成功 `;
    } catch (error) {
        //console.log(errorToString(error));
        return `${name} 删除打卡失败 ${errorToString(error)}`;
    }
}

export async function showCurrentCount(name) {
    try {
        const info = await DATABASE.prepare(
            "SELECT SUM(count_value) AS total FROM count_log WHERE count_name=?1 and id > ( \
              SELECT MAX(id) FROM count_log WHERE count_type = 'reset' and count_name=?2 \
            )"
        )
            .bind(name, name)
            .first();
        console.log(info);
        return `截止目前 ${name} 打卡数总计 ${info["total"]} 次 `;
    } catch (error) {
        console.log(errorToString(error));
        return `${name} 查询失败 ${errorToString(error)}`;
    }
}
