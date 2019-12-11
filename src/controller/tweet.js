import CONFIG from "../config/config";
import logger from "../utils/logger";
import Twit from "twit";

const twit = new Twit(CONFIG.twitter);

async function get_username(user_id = "") {
   const log = logger("get username");
   try {
      const {
         data: { screen_name }
      } = await twit.get("users/show", { user_id: user_id });

      return screen_name;
   } catch (error) {
      console.log(error);
   }
}

async function reply_to(tweet_id, user_id) {
   const log = logger("reply to");
   try {
      log.process("replying", `get screen name with ${user_id}`);
      const screen_name = await get_username(user_id);

      log.process("replying", `tweet to ${tweet_id}`);
      await twit.post("statuses/update", {
         in_reply_to_status_id: tweet_id,
         status: `@${screen_name}`
      });

      log.process("replied", `tweet to ${tweet_id}`);
   } catch (error) {
      log.error(error.message);
   }
}

export default { reply_to };
