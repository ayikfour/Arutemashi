import tweet from '../src/controller/tweet';

async function test() {
   try {
      const data = await tweet.get_tweet('1215312108214091776');
      console.log(data);
   } catch (error) {
      console.log(error);
   }
}

test();
