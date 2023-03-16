import chalk from "chalk";
import * as frida from "frida";
import { Message, MessageType } from "frida";
import path from "path";
import ts from "typescript";
import { insertCell, mkdirsSync, sleep, tsCompile } from "../util";
import process from 'process';
import ExcelJS from 'exceljs';
import md5 from 'md5';
import { IOptions } from "./test";

interface IStackTrace {
  type: string,
  time: string,
  action: string,
  messages: string,
  stacks: string
}

function isNotice (payload: IStackTrace): payload is IStackTrace {
  return payload.type === 'notice';
}

export default class FridaHook<T extends IOptions> {
  private args: T;
  private device!: frida.Device;
  private session!: frida.Session;
  private script!: frida.Script;

  private workbook!: ExcelJS.Workbook;
  private worksheet!: ExcelJS.Worksheet;
  private isHook = false;
  private rowIdx = 2;
  /**
   * 堆栈 hash
   * @type {Map<string, number>} md5, 调用次数
   */
  private stackMap: Map<string, {
    rowIdx: number;
    callNum: number;
  }> = new Map();

  constructor(args: T) {
    this.args = args;
    if (args.exportExcel) {
      const ext = path.extname(args.exportExcel);
      if (!ext) {
        this.args.exportExcel + '.xlsx';
      }
    }
  }

  async attach() {
    this.device = await frida.getUsbDevice();
    const pid = await this.device.spawn([this.args.package]);
    await sleep(1000)
    this.session = await this.device.attach(pid)

    if (this.args.exportExcel) {
      this.createExcel();
    }
    await sleep(1000)
    console.log("attached:", this.session);
    let injectScript = await tsCompile(path.resolve(__dirname, '../agent/index.ts'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        outFile: 'dist/agent.js'
      }
    }, this.args.debug ? 'dist/agent.js' : '');
    // 注入配置
    const envScript = `var Env = ${JSON.stringify({
      waitTime: this.args.waitTime
    })};\n`

    this.script = await this.session.createScript(envScript + injectScript);

    this.script.message.connect(this.messageHandler);
    await this.script.load()
    await sleep(1000)
    console.log("script loaded");
    this.device.resume(pid);

    await sleep(this.args.waitTime + 500);
    if (this.isHook) {
      process.on('SIGINT', this.sigintHandle);
    } else {
      console.log("[*] hook fail, try delaying hook, adjusting delay time")
    }
  }

  messageHandler = (message: Message, data: Buffer | null) => {
    if(message.type == MessageType.Error) {
      console.log(chalk.red(message.stack));
      process.kill(process.pid, 'SIGTERM')
      return;
    }
    const payload = message.payload;
    if (payload.type === 'isHook') {
      this.isHook = true;
    }
    if (isNotice(payload)) {
      if (this.args.verbose) {
          console.log("------------------------------start---------------------------------");
          console.log(chalk.red(`[${payload.time}]，APP行为: ${payload.action}，行为描述: ${payload.messages}`));
          console.log("[*] 调用堆栈: ");
          console.log(chalk.white(payload.stacks));
          console.log("-------------------------------end----------------------------------");
      }
      if (this.args.exportExcel) {
        const style: ExcelJS.Style = {
          numFmt: '',
          font: {
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle'
          },
          border: {},
          protection: {},
          fill: {
            type: 'pattern',
            pattern: 'none'
          }
        };
        if (this.args.merge) {
          const hash = md5(payload.stacks);
          let stack = this.stackMap.get(hash);
          if (!stack) {
            stack = {
              rowIdx: this.rowIdx,
              callNum: 0
            };
            insertCell(this.worksheet, this.rowIdx, 1, payload.time, style);
            insertCell(this.worksheet, this.rowIdx, 2, payload.action, style);
            insertCell(this.worksheet, this.rowIdx, 3, payload.messages, style);
            insertCell(this.worksheet, this.rowIdx, 4, payload.stacks);
            this.rowIdx++;
          }
          stack.callNum++;
          this.stackMap.set(hash, stack)
          insertCell(this.worksheet, stack.rowIdx, 5, this.stackMap.get(hash)?.callNum, style);
        } else {
          insertCell(this.worksheet, this.rowIdx, 1, payload.time, style);
          insertCell(this.worksheet, this.rowIdx, 2, payload.action, style);
          insertCell(this.worksheet, this.rowIdx, 3, payload.messages, style);
          insertCell(this.worksheet, this.rowIdx, 4, payload.stacks);
          this.rowIdx++;
        }
      }
    }
    if (payload.type == 'appName') {
      const isMyApp = payload.appName === this.args.package ? true : false;
      this.script.post({"isMyApp": isMyApp})
    }
  }

  sigintHandle = (signal) => {
    console.log(`Received ${signal}`);
    console.log('[*] You have stoped hook.')
    this.session.detach();
    this.device.kill(this.session.pid);
    if(this.args.exportExcel) {
      this.save();
    }
  }

  createExcel() {
    this.workbook = new ExcelJS.Workbook();
    const worksheet = this.workbook.addWorksheet('调用堆栈');
    this.worksheet = worksheet;

    const alignment: Partial<ExcelJS.Alignment> = {
      horizontal: 'center',
      vertical: 'middle'
    }
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).alignment = alignment;
    worksheet.getColumn(3).alignment = {
      ...alignment,
      wrapText: true
    };
    worksheet.getColumn(4).alignment = {
      vertical: 'top',
      wrapText: true
    }
    // 标题
    const titleStyle: ExcelJS.Style = {
      numFmt: '',
      font: {
        bold: true,
        size: 18
      },
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      },
      border: {},
      protection: {},
      fill: {
        type: 'pattern',
        pattern: 'none'
      }
    };
    insertCell(worksheet, 1, 1, '时间点', titleStyle);
    worksheet.getRow(1).height = 30
    insertCell(worksheet, 1, 2, '操作行为', titleStyle)
    worksheet.getColumn(2).width = 16
    insertCell(worksheet, 1, 3, '行为描述', titleStyle)
    worksheet.getColumn(3).width = 50
    insertCell(worksheet, 1, 4, '调用堆栈', titleStyle)
    worksheet.getColumn(4).width = 100
    if (this.args.merge) {
      insertCell(worksheet, 1, 5, '调用次数', titleStyle)
      worksheet.getColumn(5).width = 16
    }
  }

  save() {
    if (!this.args.exportExcel) return;
    mkdirsSync(path.dirname(this.args.exportExcel));
    this.workbook.xlsx.writeFile(this.args.exportExcel);
  }
}
