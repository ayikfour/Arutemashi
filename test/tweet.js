import tweet from '../src/controller/tweet';
import image from '../src/controller/image';

async function test() {
   try {
      await image.polaroid('Fuxk the police');
      console.log('done');
   } catch (error) {
      console.log(error);
   }
}

test();
