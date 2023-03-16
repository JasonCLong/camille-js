import { CommandModule } from "yargs";
import FridaHook from "./hook";
import { Argv } from "yargs";

export interface IOptions {
  package: string,
  waitTime: number,
  merge: boolean,
  exportExcel?: string,
  verbose: boolean,
  debug: boolean
}

const cmd: CommandModule<{}, IOptions> = {
  command: "$0 <package>",
  describe: '运行隐私检测工具',
  builder: function (yargs: Argv) {
    return yargs
      .options({
        package: {
          type: "string",
          desc: "APP 包名，例如: com.android.chrome",
          requiresArg: true,
        },
        waitTime: {
          alias: "t",
          type: "number",
          default: 0,
          describe: "延迟 hook, 默认为：0 秒",
        },
        merge: {
          alias: "m",
          type: 'boolean',
          default: true,
          describe: "合并相同的堆栈",
        },
        exportExcel: {
          alias: "f",
          type: "string",
          describe: "导出 Excel 的文件路径",
        },
        verbose: {
          alias: "v",
          type: "boolean",
          default: true,
          describe: "显示详细信息",
        },
        debug: {
          alias: "d",
          type: "boolean",
          default: false,
          describe: "显示 debug 信息",
        }
      })
       // 用法示例
      .usage('$0 <package>')
      .usage('$0 <package> [--verbose] [-f=<path>]')
      .example([
        // 具体用法示例
        ['$0 com.android.chrome', '# 检测包名为 "com.android.chrome" 的 app'],
      ]) as Argv<IOptions>;
  },
  handler: async (argv) => {
    const fridaHook = new FridaHook(argv);
    await fridaHook.attach();
  },
};

export default cmd;
