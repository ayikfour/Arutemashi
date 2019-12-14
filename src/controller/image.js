import jimp from "jimp";
import fs from "fs";
import unsplash from "./unsplash";

async function draw(caption = "") {
   try {
      const font = await jimp.loadFont(
         "./src/public/fonts/arial_32_yellow.fnt"
      );

      let photo = unsplash.get_random_photo();
      await unsplash.download_photo(photo);

      const image = await jimp.read(`./src/public/photos/${photo.id}.jpg`);
      await image.color([
         { apply: "greyscale", params: [100] },
         { apply: "darken", params: [5] },
         { apply: "shade", params: [20] }
      ]);

      await image.print(
         font,
         100,
         -32,
         {
            text: caption,
            alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
         },
         image.bitmap.width - 200,
         image.bitmap.height
      );

      const path = `./src/public/drawen/${photo.id}.jpg`;
      await image.writeAsync(path);

      const photo_b64 = await fs.readFileSync(path, { encoding: "base64" });
      return photo_b64;
   } catch (error) {
      throw error;
   }
}

export default { draw };
