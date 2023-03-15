import { CommandModule } from "yargs";
import FridaHook from "../hook";

const cmd: CommandModule<{}, unknown> = {
  command: "$0 <package>",
  builder: {
    package: {
      desc: "APP_NAME example: com.test.demo",
      type: "string",
      requiresArg: true,
    },
  },
  handler: async (argv: any) => {
    const fridaHook = new FridaHook(argv);
    await fridaHook.attach();
  },
};

export default cmd;
