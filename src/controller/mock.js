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
      )}... \n\nhasshhh cangkeman @${screen_name} 🙄`;

      return text;
   },
   hilih: function(content = '', screen_name) {
      const transformed = [...content.toLowerCase()]
         .map(char => (['a', 'i', 'u', 'e', 'o'].includes(char) ? 'i' : char))
         .join('');

      const text = `${transformed.substring(
         0,
         160
      )}... \n\nhilih jimbit @${screen_name} 🥵`;

      return text;
   },
   lapo: function() {
      return `kon haus afeksi ta lur? 🙄`;
   },
   goblok: function() {
      return `lah goblok, utekke nan silit 🥵`;
   },
   emosi: function(screen_name) {
      return `kalo ga ngetweet gini kamu darah rendah ya bangsat @${screen_name} 🙂`;
   }
};
