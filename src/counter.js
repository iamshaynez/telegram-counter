import { DATABASE, ENV } from "./env.js";
import { errorToString } from "./utils.js";


export async function addCount(name) {
    try {
        console.log(typeof name)
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

export async function resetCount(name) {
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

export async function showCurrentCount(name) {
    try {
        const info = await DATABASE.prepare(
            "INSERT INTO count_log (count_name, count_type, count_value, count_date) VALUES (?1, 'count', 1, date('now'))"
        )
            .bind(name)
            .run();
        
        console.log(info)
        return `${name} 打卡成功 `;
    } catch (error) {
        console.log(errorToString(error));
        return `${name} 打卡失败 ${errorToString(error)}`;
    }
}
