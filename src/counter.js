import { DATABASE, ENV } from "./env.js";
import { errorToString } from "./utils.js";

export async function commandAddCount(name, comment) {
    let messages = [];
    messages.push(await addCount(name, comment));
    messages.push(await showCurrentCount(name));
    messages.push(await showGoal(name));
    return messages.join("\n");
}

export async function commandResetCount(name) {
    let messages = [];
    messages.push(await resetCount(name));
    messages.push(await showCurrentCount(name));
    return messages.join("\n");
}

export async function commandSetGoal(name, goal, comment) {
    let messages = [];
    messages.push(await setGoal(name, goal, comment));
    messages.push(await showGoal(name));
    return messages.join("\n");
}

export async function commandShowCountHistory(name, limit) {
    let messages = [];
    messages.push(await showCountHistory(name, limit));
    return messages.join("\n");
}

async function addCount(name, comment) {
    try {
        const info = await DATABASE.prepare(
            "INSERT INTO count_log (count_name, count_type, count_value, count_date, count_comment) VALUES (?1, 'count', 1, date('now'), ?2)"
        )
            .bind(name, comment)
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
            "SELECT COALESCE(SUM(count_value),0) AS total FROM count_log WHERE count_name=?1 and id > COALESCE(( \
              SELECT MAX(id) FROM count_log WHERE count_type = 'reset' and count_name=?2 \
            ),0)"
        )
            .bind(name, name)
            .first();
        return `截止目前 ${name} 打卡数总计 ${info["total"]} 次 `;
    } catch (error) {
        console.log(errorToString(error));
        return `${name} 查询失败 ${errorToString(error)}`;
    }
}

async function setGoal(name, goal, comment) {
    try {
        await DATABASE.prepare("DELETE FROM count_goal WHERE count_name=?1")
            .bind(name)
            .run();
        await DATABASE.prepare(
            "INSERT INTO count_goal (count_name, goal_comment, goal_value) VALUES (?1, ?2, ?3)"
        )
            .bind(name, comment, goal)
            .run();

        return `${name} 打卡目标设置成功 `;
    } catch (error) {
        console.log(errorToString(error));
        return `${name} 打卡目标设置失败 ${errorToString(error)}`;
    }
}

async function showGoal(name) {
    try {
        const info = await DATABASE.prepare(
            "WITH T AS (SELECT COALESCE(SUM(count_value),0) AS total FROM count_log \
            WHERE count_name=?1 and id > COALESCE((SELECT MAX(id) FROM count_log WHERE count_type = 'reset' and count_name=?2 ),0)) \
            SELECT (goal_value - (SELECT total from T)) as diff, goal_comment FROM count_goal where count_name = ?3"
        )
            .bind(name, name, name)
            .first();
        console.log(info);
        if (!info) {
            return `未设置${name}的打卡目标`;
        }
        return `距离${info["goal_comment"]}还有 ${info["diff"]}次`;
    } catch (error) {
        console.log(errorToString(error));
        return `${name} 查询打卡目标失败 ${errorToString(error)}`;
    }
}

async function showCountHistory(name, limit) {
    try {
        const info = await DATABASE.prepare(
            "SELECT count_name, count_type, count_date, count_comment FROM count_log WHERE count_name=?1 ORDER BY id DESC LIMIT ?2"
        )
            .bind(name, limit)
            .all();

        let dataTable = messageCountRecordList(info["results"]);
        
        return "打卡历史查询成功，列表如下: \n\n" + dataTable;
    } catch (error) {
        console.log(errorToString(error));
        return `${name} 查询打卡历史失败 ${errorToString(error)}`;
    }
}

function messageCountRecordTable(data) {
    // 如果数据为空或者不是数组，返回空字符串
    if (!Array.isArray(data) || data.length == 0) {
        return "";
    }
    // 创建表头，假设所有对象有相同的key
    var header = Object.keys(data[0]);

    // 创建markdown表格的表头
    var table = header.join(" | ") + "\n";

    // 创建markdown表格的分隔线
    table += header.map(() => "---").join(" | ") + "\n";

    // 创建表格的每一行数据
    for (var i = 0; i < data.length; i++) {
        table += Object.values(data[i]).join(" | ") + "\n";
    }

    return table;
}

function messageCountRecordList(data) {
    // 如果数据为空或者不是数组，返回空字符串
    if (!Array.isArray(data) || data.length == 0) {
        return "";
    }

    var table = "";
    // 创建表格的每一行数据
    for (var i = 0; i < data.length; i++) {
        table += "> " + Object.values(data[i]).join(" | ") + "\n";
    }
    return table;
}
