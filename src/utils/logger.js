import chalk from 'chalk';
import moment from 'moment';
const log = console.log;

export default function(context = '') {
   context = context.toLowerCase();
   var padding = 15;
   var format = 'hh:mm:ss a';

   var logger = {
      error: function(message = '') {
         var time = moment()
            .format(format)
            .toUpperCase();

         log(
            chalk.red(time),
            '-',
            message,
            chalk.magenta(context),
            chalk.red.bold('error')
         );
         return this;
      },
      success: function(message = '') {
         var time = moment()
            .format(format)
            .toUpperCase();

         log(
            chalk.red(time),
            '-',
            message,
            '/',
            chalk.magenta(context),
            chalk.green.bold('success')
         );
         return this;
      },
      header: function() {
         var time = moment()
            .format(format)
            .toUpperCase();

         log(chalk.red(time), '-', chalk.magenta.bold(context.padEnd(padding)));
         return this;
      },
      process: function(subcontext = '', message = '') {
         var time = moment()
            .format(format)
            .toUpperCase();

         log(
            chalk.red(time),
            '-',
            message,
            '/',
            chalk.magenta(context),
            chalk.yellow.bold(subcontext.toLowerCase())
         );
         return this;
      }
   };
   return logger;
}
