const Redis = require("ioredis");
const { Store } = require("koa-session2");
 /**
  * redis存储
  */
class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis();
    }
    /**
     * 获取
     * @param {*} sid 
     * @param {*} ctx 
     */
    async get(sid, ctx) {
        let data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }
    /**
     * 新增
     * @param {*} session 
     * @param {*} param1 
     * @param {*} ctx 
     */
    async set(session, { sid =  this.getID(24), maxAge = 1000 * 60 * 60 } = {}, ctx) {
        try {
            console.log(`SESSION:${sid}`);
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
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
            console.log(`SESSION:${sid}`);
            // Use redis set EX to automatically drop expired sessions
            await this.redis.set(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000);
        } catch (e) {}
        return sid;
    }
    /**
     * 删除
     * @param {*} sid 
     * @param {*} ctx 
     */
    async destroy(sid, ctx) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}
 
module.exports = RedisStore;