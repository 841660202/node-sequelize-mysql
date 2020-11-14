const userAgentUtil = {
  checkPhone: (ctx) => {
    let userAgent = ctx.request.header['user-agent'].toLowerCase();
    let pat_phone = /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/;
    return pat_phone.test(userAgent);
  },
  getClientIp: (ctx) => {
    // 判断是否有反向代理 IP
    let ip =  ctx.request.headers['x-forwarded-for'] || ctx.request.headers['x-real-ip'] || ctx.request.ip
    if(ip) {
      ip = ip.replace('::ffff:', '')
    }
    console.log("user IP:", ip)
    return ip
  }
}
module.exports = userAgentUtil