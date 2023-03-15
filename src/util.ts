import ts from "typescript";
import fs from "fs";
import path from "path";
import browserify from "browserify";
import tsify from "tsify";
import chalk from "chalk";
import getStream from 'get-stream'
import ExcelJS from 'exceljs';

// 编译 ts 代码
export function tsCompile(
  source: string,
  options: ts.TranspileOptions = {},
  outfile?: string
) {
  return new Promise(async (resolve, reject) => {
    // 打包合并多个CommonJS模块
    const stream = browserify()
      .add(source) // main entry of an application
      .plugin(tsify, Object.assign({ noImplicitAny: false }, options.compilerOptions))
      .bundle()
      .on("error", function (error: Error) {
        console.log(chalk.red(error));
        reject(error);
      });
    // Default options -- you could also perform a merge, or use the project tsconfig.json
    if (!options) {
      options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
    }
    if (!fs.existsSync(source)) return "";
    // const code = fs.readFileSync(source).toString("utf-8");
    // const script = ts.transpileModule(code, options).outputText;
    const script = await getStream(stream);
    if (outfile) {
      mkdirsSync(path.dirname(outfile));
      fs.writeFileSync(outfile, script);
    }
    resolve(script);
  });
}

/**
 * 递归创建目录
 */
export function mkdirsSync(dirname: string) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

export function sleep (millisecond: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
        resolve(undefined);
    }, millisecond);
  })
}

export function insertCell(
  sheet: ExcelJS.Worksheet,
  row: string | number,
  col: string | number,
  value?: ExcelJS.CellValue,
  style?: ExcelJS.Style) {
  const cell = sheet.getCell(row, col);
  cell.value = value;
  if (style) {
    cell.style = style;
  }
}
