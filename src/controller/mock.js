import chalk from 'chalk';
const log = console.log;

export default {
   hah: function(content = '', screen_name) {
      const transformed = [...content]
         .map((char, i) => char[`to${i % 2 ? 'Upper' : 'Lower'}Case`]())
         .join('');

      const text = `${transformed.substring(
         0,
         160
      )}... \n hasshhh cangkeman @${screen_name} 🙄`;

      return text;
   },
   sircistify: function(content = '') {
      return [...content.toLowerCase()]
         .map(char => (['a', 'i', 'u', 'e', 'o'].includes(char) ? 'i' : char))
         .join('');
   }
};
