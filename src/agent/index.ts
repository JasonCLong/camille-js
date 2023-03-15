import { sendNotice } from "./util";

// APP申请权限
function checkRequestPermission() {
  // var ActivityCompat = Java.use("androidx.core.app.ActivityCompat")
  var ActivityCompat = Java.use("android.app.Activity");

  ActivityCompat.requestPermissions.overload(
    "[Ljava.lang.String;",
    "int"
  ).implementation = function (p1, p2, p3) {
    var temp = this.requestPermissions(p1, p2, p3);
    sendNotice("APP申请权限", "申请权限为: " + p2);
    return temp;
  };
}

// APP获取IMEI/IMSI
function getPhoneState() {
  var TelephonyManager = Java.use("android.telephony.TelephonyManager");

  // API level 26 获取单个IMEI的方法
  TelephonyManager.getDeviceId.overload().implementation = function () {
    var temp = this.getDeviceId();
    sendNotice("获取IMEI", "获取的IMEI为: " + temp);
    return temp;
  };

  //API level 26 获取多个IMEI的方法
  TelephonyManager.getDeviceId.overload("int").implementation = function (p) {
    var temp = this.getDeviceId(p);
    sendNotice("获取IMEI", "获取(" + p + ")的IMEI为: " + temp);
    return temp;
  };

  //API LEVEL26以上的获取单个IMEI方法
  TelephonyManager.getImei.overload().implementation = function () {
    var temp = this.getImei();
    sendNotice("获取IMEI", "获取的IMEI为: " + temp);
    return temp;
  };

  // API LEVEL26以上的获取多个IMEI方法
  TelephonyManager.getImei.overload("int").implementation = function (p) {
    var temp = this.getImei(p);
    sendNotice("获取IMEI", "获取(" + p + ")的IMEI为: " + temp);
    return temp;
  };

  //imsi/iccid
  TelephonyManager.getSimSerialNumber.overload().implementation = function () {
    var temp = this.getSimSerialNumber();
    sendNotice("获取IMSI/iccid", "获取IMSI/iccid为(String): " + temp);
    return temp;
  };

  //imsi
  TelephonyManager.getSubscriberId.overload().implementation = function () {
    var temp = this.getSubscriberId();
    sendNotice("获取IMSI", "获取IMSI为(int): " + temp);
    return temp;
  };

  //imsi/iccid
  TelephonyManager.getSimSerialNumber.overload("int").implementation =
    function (p) {
      var temp = this.getSimSerialNumber(p);
      sendNotice(
        "获取IMSI/iccid",
        "参数为: (" + p + "), 获取IMSI/iccid为(int): " + temp
      );
      return temp;
    };
}

// 获取系统属性（记录关键的）
function getSystemProperties() {
  var SystemProperties = Java.use("android.os.SystemProperties");

  SystemProperties.get.overload("java.lang.String").implementation = function (
    p1
  ) {
    var temp = this.get(p1);
    if (p1 == "ro.serialno") {
      sendNotice("获取设备序列号", "获取(" + p1 + ")，值为: " + temp);
    }
    if (p1 == "ro.build.display.id") {
      sendNotice("获取版本号", "获取(" + p1 + ")，值为: " + temp);
    }
    //MEID
    if (p1 == "ril.cdma.meid") {
      sendNotice("获取MEID", "获取(" + p1 + ")，值为: " + temp);
    }
    //手机型号
    if (p1 == "ro.product.model") {
      sendNotice("获取手机型号", "获取(" + p1 + ")，值为: " + temp);
    }
    //手机厂商
    if (p1 == "ro.product.manufacturer") {
      sendNotice("获取手机厂商", "获取(" + p1 + ")，值为: " + temp);
    }

    return temp;
  };

  SystemProperties.get.overload(
    "java.lang.String",
    "java.lang.String"
  ).implementation = function (p1, p2) {
    var temp = this.get(p1, p2);

    if (p1 == "ro.serialno") {
      sendNotice(
        "获取设备序列号",
        "获取(" + p1 + " 、 " + p2 + ")，值为: " + temp
      );
    }
    if (p1 == "ro.build.display.id") {
      sendNotice("获取版本号", "获取(" + p1 + " 、 " + p2 + ")，值为: " + temp);
    }
    //MEID
    if (p1 == "ril.cdma.meid") {
      sendNotice("获取MEID", "获取(" + p1 + " 、 " + p2 + ")，值为: " + temp);
    }
    //手机型号
    if (p1 == "ro.product.model") {
      sendNotice(
        "获取手机型号",
        "获取(" + p1 + " 、 " + p2 + ")，值为: " + temp
      );
    }
    //手机厂商
    if (p1 == "ro.product.manufacturer") {
      sendNotice(
        "获取手机厂商",
        "获取(" + p1 + " 、 " + p2 + ")，值为: " + temp
      );
    }

    return temp;
  };

  SystemProperties.getInt.overload("java.lang.String", "int").implementation =
    function (p1, p2) {
      var temp = this.getInt(p1, p2);

      if (p1 == "ro.build.version.sdk") {
        sendNotice("获取SDK版本号", "获取(" + p1 + ")，值为: " + temp);
      }

      return temp;
    };
}

//获取content敏感信息
function getContentProvider() {
  var ContentResolver = Java.use("android.content.ContentResolver");

  // 通讯录内容
  var ContactsContract = Java.use("android.provider.ContactsContract");
  var contact_authority = ContactsContract.class
    .getDeclaredField("AUTHORITY")
    .get("java.lang.Object");

  // 日历内容
  var CalendarContract = Java.use("android.provider.CalendarContract");
  var calendar_authority = CalendarContract.class
    .getDeclaredField("AUTHORITY")
    .get("java.lang.Object");

  // 浏览器内容
  var BrowserContract = Java.use("android.provider.BrowserContract");
  var browser_authority = BrowserContract.class
    .getDeclaredField("AUTHORITY")
    .get("java.lang.Object");

  ContentResolver.query.overload(
    "android.net.Uri",
    "[Ljava.lang.String;",
    "android.os.Bundle",
    "android.os.CancellationSignal"
  ).implementation = function (p1, p2, p3, p4) {
    var temp = this.query(p1, p2, p3, p4);
    if (p1.toString().indexOf(contact_authority) != -1) {
      sendNotice("获取content敏感信息", "获取手机通信录内容");
    } else if (p1.toString().indexOf(calendar_authority) != -1) {
      sendNotice("获取content敏感信息", "获取日历内容");
    } else if (p1.toString().indexOf(browser_authority) != -1) {
      sendNotice("获取content敏感信息", "获取浏览器内容");
    }
    return temp;
  };
}

// 获取安卓ID
function getAndroidId() {
  var SettingsSecure = Java.use("android.provider.Settings$Secure");

  SettingsSecure.getString.implementation = function (p1, p2) {
    if (p2.indexOf("android_id") < 0) {
      return this.getString(p1, p2);
    }
    var temp = this.getString(p1, p2);
    sendNotice("获取Android ID", "参数为: " + p2 + "，获取到的ID为: " + temp);
    return temp;
  };
}

//获取其他app信息
function getPackageManager() {
  var PackageManager = Java.use("android.content.pm.PackageManager");
  var ApplicationPackageManager = Java.use(
    "android.app.ApplicationPackageManager"
  );
  var ActivityManager = Java.use("android.app.ActivityManager");

  PackageManager.getInstalledPackages.overload("int").implementation =
    function (p1) {
      var temp = this.getInstalledPackages(p1);
      sendNotice("获取其他app信息", "1获取的数据为: " + temp);
      return temp;
    };

  PackageManager.getInstalledApplications.overload("int").implementation =
    function (p1) {
      var temp = this.getInstalledApplications(p1);
      sendNotice(
        "获取其他app信息",
        "getInstalledApplications获取的数据为: " + temp
      );
      return temp;
    };

  ApplicationPackageManager.getInstalledPackages.overload(
    "int"
  ).implementation = function (p1) {
    var temp = this.getInstalledPackages(p1);
    sendNotice("获取其他app信息", "getInstalledPackages获取的数据为: " + temp);
    return temp;
  };

  ApplicationPackageManager.getInstalledApplications.overload(
    "int"
  ).implementation = function (p1) {
    var temp = this.getInstalledApplications(p1);
    sendNotice(
      "获取其他app信息",
      "getInstalledApplications获取的数据为: " + temp
    );
    return temp;
  };

  ApplicationPackageManager.queryIntentActivities.implementation = function (
    p1,
    p2
  ) {
    var temp = this.queryIntentActivities(p1, p2);
    sendNotice(
      "获取其他app信息",
      "参数为: " + p1 + p2 + "，queryIntentActivities获取的数据为: " + temp
    );
    return temp;
  };

  ApplicationPackageManager.getApplicationInfo.implementation = function (
    p1,
    p2
  ) {
    var temp = this.getApplicationInfo(p1, p2);
    var isMyApp;
    // 判断是否为自身应用，是的话不记录
    send({ type: "appName", appName: p1 });

    recv(function (received_json_object) {
      isMyApp = received_json_object.isMyApp;
    }).wait();

    if (!isMyApp) {
      sendNotice("获取其他app信息", "getApplicationInfo获取的数据为: " + temp);
    }
    return temp;
  };

  ActivityManager.getRunningAppProcesses.implementation = function () {
    var temp = this.getRunningAppProcesses();
    sendNotice("获取其他app信息", "获取了正在运行的App");
    return temp;
  };
}

// 获取位置信息
function getGSP() {
  var locationManager = Java.use("android.location.LocationManager");

  locationManager.getLastKnownLocation.overload(
    "java.lang.String"
  ).implementation = function (p1) {
    var temp = this.getLastKnownLocation(p1);
    sendNotice("获取位置信息", "获取位置信息，参数为: " + p1);
    return temp;
  };

  locationManager.requestLocationUpdates.overload(
    "java.lang.String",
    "long",
    "float",
    "android.location.LocationListener"
  ).implementation = function (p1, p2, p3, p4) {
    var temp = this.requestLocationUpdates(p1, p2, p3, p4);
    sendNotice("获取位置信息", "获取位置信息");
    return temp;
  };
}

// 调用摄像头(hook，防止静默拍照)
function getCamera() {
  var Camera = Java.use("android.hardware.Camera");

  Camera.open.overload("int").implementation = function (p1) {
    var temp = this.open(p1);
    sendNotice("调用摄像头", "调用摄像头id: " + p1.toString());
    return temp;
  };
}

//获取网络信息
function getNetwork() {
  var WifiInfo = Java.use("android.net.wifi.WifiInfo");

  //获取ip
  WifiInfo.getIpAddress.implementation = function () {
    var temp = this.getIpAddress();

    var _ip = new Array();
    _ip[0] = (temp >>> 24) >>> 0;
    _ip[1] = ((temp << 8) >>> 24) >>> 0;
    _ip[2] = (temp << 16) >>> 24;
    _ip[3] = (temp << 24) >>> 24;
    var _str =
      String(_ip[3]) +
      "." +
      String(_ip[2]) +
      "." +
      String(_ip[1]) +
      "." +
      String(_ip[0]);

    sendNotice("获取网络信息", "获取IP地址: " + _str);
    return temp;
  };
  //获取mac地址
  WifiInfo.getMacAddress.implementation = function () {
    var temp = this.getMacAddress();
    sendNotice("获取Mac地址", "获取到的Mac地址: " + temp);
    return temp;
  };

  WifiInfo.getSSID.implementation = function () {
    var temp = this.getSSID();
    sendNotice("获取wifi SSID", "获取到的SSID: " + temp);
    return temp;
  };

  WifiInfo.getBSSID.implementation = function () {
    var temp = this.getBSSID();
    sendNotice("获取wifi BSSID", "获取到的BSSID: " + temp);
    return temp;
  };

  var WifiManager = Java.use("android.net.wifi.WifiManager");

  // 获取wifi信息
  WifiManager.getConnectionInfo.implementation = function () {
    var temp = this.getConnectionInfo();
    sendNotice("获取wifi信息", "获取wifi信息");
    return temp;
  };

  var InetAddress = Java.use("java.net.InetAddress");

  //获取IP
  InetAddress.getHostAddress.implementation = function () {
    var temp = this.getHostAddress();

    sendNotice("获取网络信息", "获取IP地址: " + temp.toString());
    return temp;
  };

  var NetworkInterface = Java.use("java.net.NetworkInterface");

  //获取mac
  NetworkInterface.getHardwareAddress.overload().implementation = function () {
    var temp = this.getHardwareAddress();
    sendNotice("获取Mac地址", "获取到的Mac地址: " + temp);
    return temp;
  };

  var NetworkInfo = Java.use("android.net.NetworkInfo");

  NetworkInfo.getType.implementation = function () {
    var temp = this.getType();
    sendNotice("获取网络信息", "获取网络类型: " + temp.toString());
    return temp;
  };

  NetworkInfo.getTypeName.implementation = function () {
    var temp = this.getTypeName();
    sendNotice("获取网络信息", "获取网络类型名称: " + temp);
    return temp;
  };

  NetworkInfo.getExtraInfo.implementation = function () {
    var temp = this.getExtraInfo();
    sendNotice("获取网络信息", "获取网络名称: " + temp);
    return temp;
  };

  NetworkInfo.isAvailable.implementation = function () {
    var temp = this.isAvailable();
    sendNotice("获取网络信息", "获取网络是否可用: " + temp.toString());
    return temp;
  };

  NetworkInfo.isConnected.implementation = function () {
    var temp = this.isConnected();
    sendNotice("获取网络信息", "获取网络是否连接: " + temp.toString());
    return temp;
  };
}

//获取蓝牙设备信息
function getBluetooth() {
  var BluetoothDevice = Java.use("android.bluetooth.BluetoothDevice");

  //获取蓝牙设备名称
  BluetoothDevice.getName.overload().implementation = function () {
    var temp = this.getName();
    sendNotice("获取蓝牙信息", "获取到的蓝牙设备名称: " + temp);
    return temp;
  };

  //获取蓝牙设备mac
  BluetoothDevice.getAddress.implementation = function () {
    var temp = this.getAddress();
    sendNotice("获取蓝牙信息", "获取到的蓝牙设备mac: " + temp);
    return temp;
  };

  var BluetoothAdapter = Java.use("android.bluetooth.BluetoothAdapter");

  //获取蓝牙设备名称
  BluetoothAdapter.getName.implementation = function () {
    var temp = this.getName();
    sendNotice("获取蓝牙信息", "获取到的蓝牙设备名称: " + temp);
    return temp;
  };
}

//获取基站信息
function getCidorLac() {
  // 电信卡cid lac
  var CdmaCellLocation = Java.use("android.telephony.cdma.CdmaCellLocation");

  CdmaCellLocation.getBaseStationId.implementation = function () {
    var temp = this.getBaseStationId();
    sendNotice("获取基站信息", "获取到的cid: " + temp);
    return temp;
  };
  CdmaCellLocation.getNetworkId.implementation = function () {
    var temp = this.getNetworkId();
    sendNotice("获取基站信息", "获取到的lac: " + temp);
    return temp;
  };

  // 移动 联通卡 cid/lac
  var GsmCellLocation = Java.use("android.telephony.gsm.GsmCellLocation");

  GsmCellLocation.getCid.implementation = function () {
    var temp = this.getCid();
    sendNotice("获取基站信息", "获取到的cid: " + temp);
    return temp;
  };
  GsmCellLocation.getLac.implementation = function () {
    var temp = this.getLac();
    sendNotice("获取基站信息", "获取到的lac: " + temp);
    return temp;
  };
}

// 获取短信相关信息/发送短信
function getSMSManager() {
  var SmsManager = Java.use("android.telephony.SmsManager");
  SmsManager.sendTextMessageInternal.overload(
    "java.lang.String",
    "java.lang.String",
    "java.lang.String",
    "android.app.PendingIntent",
    "android.app.PendingIntent",
    "boolean",
    "int",
    "boolean",
    "int"
  ).implementation = function (p1, p2, p3, p4, p5, p6, p7, p8, p9) {
    var temp = this.sendTextMessageInternal(p1, p2, p3, p4, p5, p6, p7, p8, p9);
    sendNotice("获取短信信息", "发送短信 '" + p3 + "' to '" + p1 + "'");
    return temp;
  };

  // sendTextMessageWithSelfPermissions is undefault
  // SmsManager.sendTextMessageWithSelfPermissions.implementation = function (p1, p2, p3, p4, p5, p6) {
  //     var temp = this.sendTextMessageWithSelfPermissions(p1, p2, p3, p4, p5, p6);
  //     sendNotice("获取短信信息", "发送短信 '" + p3 + "' to '" + p1 + "'");
  //     return temp;
  // }

  SmsManager.sendMultipartTextMessageInternal.overload(
    "java.lang.String",
    "java.lang.String",
    "java.util.List",
    "java.util.List",
    "java.util.List",
    "boolean",
    "int",
    "boolean",
    "int"
  ).implementation = function (p1, p2, p3, p4, p5, p6, p7, p8, p9) {
    var temp = this.sendMultipartTextMessageInternal(
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      p7,
      p8,
      p9
    );
    sendNotice(
      "获取短信信息",
      "发送短信 '" + p3.toString() + "' to '" + p1 + "'"
    );
    return temp;
  };

  SmsManager.sendDataMessage.implementation = function (
    p1,
    p2,
    p3,
    p4,
    p5,
    p6
  ) {
    var temp = this.sendDataMessage(p1, p2, p3, p4, p5, p6);
    sendNotice(
      "获取短信信息",
      "发送短信 '" + p4.toString() + "' to '" + p1 + "'"
    );
    return temp;
  };

  // sendDataMessageWithSelfPermissions is undefault
  // SmsManager.sendDataMessageWithSelfPermissions.implementation = function (p1, p2, p3, p4, p5, p6) {
  //     var temp = this.sendDataMessageWithSelfPermissions(p1, p2, p3, p4, p5, p6);
  //     sendNotice("获取短信信息", "发送短信 '" + p4.toString() + "' to '" + p1 + "'");
  //     return temp;
  // }
}

function main() {
  Java.perform(function () {
    console.log("合规检测敏感接口开始监控...");
    send({ type: "isHook" });
    checkRequestPermission();
    getPhoneState();
    getSystemProperties();
    getContentProvider();
    getAndroidId();
    getPackageManager();
    getGSP();
    getCamera();
    getNetwork();
    getBluetooth();
    getCidorLac();
    getSMSManager();
  });
}

//在spawn模式下，hook系统API时如javax.crypto.Cipher建议使用setImmediate立即执行，不需要延时
//在spawn模式下，hook应用自己的函数或含壳时，建议使用setTimeout并给出适当的延时(500~5000)
if (Env.waitTime) {
  setTimeout(main, 3000);
} else {
  main();
}
