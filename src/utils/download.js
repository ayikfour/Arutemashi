import Path from "path";
import download from "image-downloader";
import chalk from "chalk";
const log = console.log;

async function photo(url = "", id = "") {
   try {
      let options = {
         url: url,
         dest: Path.resolve(__dirname, "../public/photos/", `${id}.jpg`)
      };

      const { filename, image } = await download.image(options);
      return filename;
   } catch (error) {
      console.log(error.message);
      return false;
   }
}

export default { photo };
