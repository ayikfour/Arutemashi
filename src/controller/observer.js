import CONFIG from "../config/config";
import Twit from "twit";
import db from "../helper/database";
import tweet from "./tweet";

const twit = new Twit(CONFIG.twitter);

async function mention() {
   try {
      const params = build_params();
      const mention = await twit.get("statuses/mentions_timeline");
      console.log(mention.data.event);
   } catch (error) {
      console.log(error);
   }
}
async function get_user(screen_name = "") {
   try {
      const params = build_params();
      const timeline = await twit.get("statuses/user_timeline", params);
      let data = tweet.build.tweets(timeline.data);
      tweets.update(data);
      tweets.set_since_id(data[0].id);
   } catch (error) {
      console.log(error);
   }
}

function build_params(
   count = 20,
   trim_user = true,
   include_entities = false,
   screen_name = "paswotnya",
   max_id = undefined,
   since_id = undefined
) {
   let since = tweets.get_since_id();
   return { count, trim_user, include_entities, since, screen_name };
}

const tweets = {
   get_max_id: function() {
      return db.tweets.get("max_id").value();
   },
   set_max_id: function(id = 0) {
      db.tweets
         .get("max_id")
         .assign(id)
         .write();
   },
   get_since_id: function() {
      return db.tweets.get("since_id").value();
   },
   set_since_id: function(id = 0) {
      return db.tweets.update("since_id", since => id).write();
   },
   update: function(fetched = []) {
      const difference = db.tweets
         .get("old")
         .xorBy(fetched, "id")
         .value();

      const union = db.tweets
         .get("new")
         .unionBy(difference, "id")
         .value();

      db.tweets
         .get("new")
         .assign(union)
         .write();
   },
   old: function() {
      return db.tweets.get("old").value();
   }
};

export default { mention, get_user };
