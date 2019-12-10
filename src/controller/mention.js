import CONFIG from "../config/config";
import Twit from "twit";
import db from "../helper/database";

const twit = new Twit(CONFIG.twitter);

async function get_mention() {
   try {
      const mention = await twit.get("statuses/mentions_timeline");
      console.log(mention.data.event);
   } catch (error) {
      console.log(error);
   }
}
