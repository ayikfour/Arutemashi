import chalk from 'chalk';
const log = console.log;

export default {
   sarcastify: function(content = '') {
      return [...content]
         .map((char, i) => char[`to${i % 2 ? 'Upper' : 'Lower'}Case`]())
         .join('');
   },
   sircistify: function(content = '') {
      return [...content.toLowerCase()]
         .map(char => (['a', 'i', 'u', 'e', 'o'].includes(char) ? 'i' : char))
         .join('');
   }
};
