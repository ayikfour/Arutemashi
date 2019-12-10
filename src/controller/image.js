import jimp from "jimp";

async function draw(caption = "", id = "untitled") {
   try {
      const font = await jimp.loadFont(
         "./src/public/fonts/arial_16_yellow.fnt"
      );

      const image = await jimp.read(`./src/public/images/${id}.jpg`);
      await image.color([{ apply: "greyscale", params: [100] }]);
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
      await image.write(`./src/public/drawen/imgs.jpg`);
      console.log("Written!");
   } catch (error) {
      console.log(error);
   }
}

export default { draw };
