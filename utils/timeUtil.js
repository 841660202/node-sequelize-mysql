const dayjs = require('dayjs') 
const timeUtil = {
  date: (v,f="YYYY-MM-DD HH:mm:ss")=>{
    return dayjs(v).format(f)
  }
}
module.exports = timeUtil