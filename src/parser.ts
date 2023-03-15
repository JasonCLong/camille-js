import yargs from "yargs/yargs";
import pkg from "../package.json";
import test from "./cmds/test";
import { hideBin } from "yargs/helpers";

const parser = yargs(hideBin(process.argv))
  .usage("Usage: compliance [package]")
  .example("compliance com.wechat", "say hello to zxmf")
  .epilog("copyright 2021")
  .command(test)
  .option("package", {
    alias: "p",
    type: "string",
    require: true,
    describe: "APP_NAME ex: com.test.demo",
  })
  .option("wait-time", {
    alias: "t",
    type: "number",
    default: 0,
    describe: "Delayed hook, the number is in seconds ex: 5",
  })
  .option("verbose", {
    alias: "v",
    type: "boolean",
    default: true,
    describe: "Showing the alert message",
  })
  .option("merge", {
    alias: "m",
    type: 'boolean',
    describe: "Merge the same stack",
  })
  .option("exportExecl", {
    alias: "f",
    type: "string",
    describe: "Name of Excel file to write",
  })
  .option("debug", {
    alias: "d",
    type: "boolean",
    describe: "debuger will export script",
  })
  .version(pkg.version)
  .fail(false);

export default parser;

type arg = typeof parser.argv;
export type IArgs = Exclude<arg, Promise<arg>>;
