/**
 * 统一接口返回数据
 * @param {*} option 
 */
module.exports = function response(option = {}) {
    return async function (ctx, next) {
        /**
         * 成功返回
         * @example {"code":200,"msg":"success","data":{"items":[]}}
         * @param {*} data 
         * @param {*} msg 
         */
        ctx.success = function (data, msg) {
            ctx.type = option.type || 'json'
            ctx.body = {
                code: option.successCode || "000000",
                msg: msg,
                data: data
            }
        }
        /**
         * 失败返回
         * @example {"code":99, "msg":"参数不完整"}
         * @param {*} msg 
         * @param {*} code 
         */
        ctx.fail = function (msg, code) {
            ctx.type = option.type || 'json'
            ctx.body = {
                code: code || option.failCode || "999999",
                msg: msg || option.successMsg || 'fail',
            }
            console.log(ctx.body)
        }

        await next()
    }
}