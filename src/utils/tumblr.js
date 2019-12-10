import tumblr from "tumblr.js";
import CONFIG from "../config/config";

const client = new tumblr.Client({
   consumer_key: CONFIG.tumblr.consumer_key,
   consumer_secret: CONFIG.tumblr.consumer_secret,
   token: CONFIG.tumblr.token,
   token_secret: CONFIG.tumblr.token_secret
});
