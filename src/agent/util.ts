
// 获取调用链
export function getStackTrace() {
  var Exception = Java.use("java.lang.Exception");
  var ins = Exception.$new("Exception");
  var straces = ins.getStackTrace();
  if (undefined == straces || null == straces) {
      return;
  }
  var result = "";
  for (var i = 0; i < straces.length; i++) {
      var str = "   " + straces[i].toString();
      result += str + "\r\n";
  }
  Exception.$dispose();
  return result;
}

//告警发送
export function sendNotice(action: any, messages: string) {
  var myDate = new Date();
  var _time = myDate.getFullYear() + "-" + myDate.getMonth() + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
  send({"type": "notice", "time": _time, "action": action, "messages": messages, "stacks": getStackTrace()});
}
