import CONFIG from "../config/config";
import Unsplash, { toJson } from "unsplash-js";
import download from "../utils/download";
import db from "../helper/database";
import logger from "../utils/logger";

const context = {
   get: "get photos",
   download: "download photos"
};

const unsplash = new Unsplash({
   accessKey: CONFIG.unsplash.access_key,
   secret: CONFIG.unsplash.secret_key
});

async function get_photos() {
   const log = logger(context.get);
   log.header("Fetching photo from unsplash");
   try {
      let keywords = db.photos.get("keywords").value();
      let page = db.photos.get("page").value();
      let current_total_page = db.photos.get("total_page").value();

      log.process("keywords", `${keywords}`);
      log.process("page", `${page} from ${current_total_page} pages`);

      let response = await unsplash.search.photos(keywords, page, 30, {
         orientation: "landscape"
      });

      let { results, total, total_pages } = await toJson(response);

      log.success(`fetched ${results.length} photos from ${total}`);

      if (!results) throw new Error("Results is empty, try fetching again.");

      results = clean_photos(results);

      update_photos(results, total, total_pages);

      log.success("All data has been saved");
   } catch (error) {
      log.error(error.message);
   }
}

function clean_photos(photos = []) {
   return photos.map(photo => {
      let { id, urls, links, description, tags } = photo;
      let user = photo.user.username;
      if (tags) {
         tags = tags.map(tag => tag.title);
      }
      let downloaded = false;
      return { id, description, urls, links, user, tags, downloaded };
   });
}

function update_photos(results, total_photos, total_pages) {
   results.map(photo => {
      db.photos
         .get("photos")
         .push(photo)
         .write();
   });

   results.map(photo => {
      let { tags } = photo;
      db.photos
         .get("tags")
         .push(tags)
         .write();
   });
   db.photos.update("page", n => n + 1).write();
   db.photos.update("count", n => n + results.length).write();
   db.photos.update("total_photo", n => total_photos).write();
   db.photos.update("total_page", n => total_pages).write();
}

function get_random_image() {}

async function download_photo(option = CONFIG.downloads.small) {
   //setup logger context
   const log = logger(context.download);

   //log the header of function
   log.header("downloading photo from unsplash");
   try {
      // get photo from database where downloaded status is false
      const photo = db.photos
         .get("photos")
         .find({ downloaded: false })
         .value();

      // check if photo is empty, if true throwing error
      if (!photo) throw new Error("No photo to download");

      log.process("url", photo.urls[option]);

      // downloading photo using download module, storing path into result.
      let result = await download.photo(photo.urls[option], photo.id);

      // check if result empty, then error ocured.
      if (!result) throw new Error("Failed while downloading photo");

      // change photo status to "downloaded" in database.
      db.photos
         .get("photos")
         .find({ id: photo.id })
         .assign({ downloaded: true })
         .write();

      log.success("photo has been downloaded");
      log.success(`path ${result}`);

      // returning result (path of the image)
      return result;
   } catch (error) {
      log.error(error.message);
   }
}

async function delete_photo() {}
export default { get_photos, download_photo };
