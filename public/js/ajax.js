
function request(option) {
  if (String(option) !== "[object Object]") return undefined
  option.method = option.method ? option.method.toUpperCase() : "GET"
  option.data = option.data || {}

  if (option.method === "GET") {
    const data = []
    for (let key in option.data) {
      data.push("".concat(key, '=', option.data[key]))
    }
    option.data = data.join("&")
    if (data.length > 0) {
      option.url += location.search.length === 0 ? "".concat("?", option.data) : "".concat("&", option.data)
    }
  }
  // 实例化
  const xhr = new XMLHttpRequest();
  // 接收类型
  xhr.responseType = option.responseType || 'json';
  // 返回状态改变
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (option.success && typeof option.success === "function") {
          option.success(xhr.response)
        }
      } else {
        if (option.error && typeof option.error === "function") {
          option.error()
        }
      }
    }
  }
  xhr.open(option.method, option.url, true)
  if (option.method === "POST") {
    xhr.setRequestHeader("Content-Type", "application/json")
  }
  xhr.send(option.method === "POST" ? option.data : null)
}