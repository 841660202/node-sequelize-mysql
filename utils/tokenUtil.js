const Redis = require("ioredis");
 /**
  * redis存储
  */
class TokenStore {
    constructor() {
        this.redis = new Redis();
    }
    /**
     * 获取
     * @param {*} sid 
     * @param {*} ctx 
     */
    async get(sid, ctx) {
        let data = await this.redis.get(`${sid}`);
        return JSON.parse(data);
    }
    /**
     * 新增
     * @param {*} session 
     * @param {*} param1 
     * @param {*} ctx 
     */
    async set(session, { sid, maxAge = 1000 * 60 * 60 } = {}, ctx) {
        try {
            console.log(`${sid}`);
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
        } catch (e) {}
        return sid;
    }
    /**
     * 刷新
     * @param {*} sid 
     * @param {*} session 
     * @param {*} maxAge 
     * @param {*} ctx 
     */
    async refresh(sid, session, maxAge = 1000 * 60 * 60, ctx) {
        try {
            console.log(`${sid}`);
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
        } catch (e) {}
        return sid;
    }
    /**
     * 删除
     * @param {*} sid 
     * @param {*} ctx 
     */
    async destroy(sid, ctx) {
        return await this.redis.del(`${sid}`);
    }
}
 
module.exports = new TokenStore();