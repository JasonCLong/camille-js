import parser from "./parser";
import chalk from "chalk";

process.env.FORCE_COLOR = "true";

(async () => {
  try {
    await parser.parse();
  } catch (error) {
    const err: Error = error as Error;
    console.error(chalk.red(`${err.stack}`));
  }
})();
