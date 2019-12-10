import chalk from "chalk";
const log = console.log;

function sircistic(content = "") {
   log(chalk.red("sircisting:"), chalk.yellow(content));
   return [...content]
      .map(char => (["a", "i", "u", "e", "o"].includes(char) ? "i" : char))
      .join("");
}

function sarcastic(content = "") {
   log(chalk.red("sarcasting:"), chalk.yellow(content));
   return [...content]
      .map((char, i) => char[`to${i % 2 ? "Upper" : "Lower"}Case`]())
      .join("");
}

export default { sircistic, sarcastic };
