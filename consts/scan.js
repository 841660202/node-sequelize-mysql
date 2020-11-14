/**
 *  扫码登录code
 *  注：/consts/文件下常量按照 业务拆分，我觉得这样可以降低多个业务耦合度
 */
const SCAN_STATUS = {
 "-1": "系统异常",
 "0": "等待扫描",
 "1": "已扫描等待确定",
 "2": "移动端确定",
 "3": "移动端确定超时",
 "4": "会话过期",
 "5": "移动端拒绝",
}
const SCAN_MAX_AGE = 1000 * 60 *10
module.exports = {
  SCAN_STATUS,
  SCAN_MAX_AGE
}