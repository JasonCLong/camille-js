import yargs from "yargs/yargs";
import pkg from "../package.json";
import test from "./cmds/test";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";

const parser = yargs(hideBin(process.argv))
  .strict()
  .command(test)
  .fail(function (msg, err, yargs) {
    console.error(yargs.help());
    console.error(chalk.red(`\n\n\n===== Execute failed. =====\n\n${msg || err}\n`));
    process.exit(1);
  })
  .showHelpOnFail(true, '命令指定 --help 查看有效的选项')
  .wrap(null)
  .locale('zh_CN')
  .version(pkg.version)
  .alias('V', 'version')
  .help('help', '查看命令行帮助')
  .alias('h', 'help');

export default parser;

