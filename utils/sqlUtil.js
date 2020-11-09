const sqlUtil = {
  pageNo: (pageNo, pageSize)=>{
    return (pageNo - 1) * pageSize
  }
}
module.exports = sqlUtil