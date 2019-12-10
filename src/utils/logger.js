import chalk from "chalk";
import moment from "moment";
const log = console.log;

export default function(context) {
   var context = context.toUpperCase();
   var time = moment()
      .format("h:mm:ss a")
      .toUpperCase();

   var logger = {
      error: function(message = "") {
         log(time, chalk.red("ERROR", context));
         log(time, chalk.red(context), message);
         return this;
      },
      success: function(message = "") {
         log(time, chalk.green("SUCCESS"), chalk.grey(context), message);
         return this;
      },
      header: function(message = "") {
         log(time, chalk.magenta.bold(context, message));
         return this;
      },
      process: function(subcontext = "", message = "") {
         log(time, chalk.yellow(subcontext.toUpperCase()), message);
         return this;
      }
   };
   return logger;
}
