import fs from 'fs';
import unsplash from './unsplash';
import canvas from 'node-html-to-image';
import db from '../helper/database';

async function polaroid(caption = '') {
   try {
      let photo = db.photos.get_random_photo();
      const path = `./src/public/drawen/${photo.id}.jpg`;
      const color = '4E4E4E';
      await canvas({
         output: path,
         html: `
         <html lang="en">
            <head>
               <title>Hello!</title>
               <link href="https://fonts.googleapis.com/css?family=Poppins:400,500,700,800&display=swap" rel="stylesheet">
               <style>
                  
                  .container{
                     width: 1080px;
                     height: 1080px;
                     display: flex;
                     align-items: center;
                     justify-content: center;
                     position: relative;
                     margin: 0 !important;
                     background-color: black;
                  }
                  
               
                  .frame{
                     display: flex;
                     flex-direction: column;
                     padding: 24px;
                     width: 720px;
                     height: 880px;
                     background: white;
                  }
                  
                  .image-container{
                     width: inherit;
                     height: calc(100% - 160px);
                     background-image: url("${photo.urls.regular}&monochrome=${color}");
                     background-size: cover;
                     background-position: center;
                     display: inline-flex;
                  }
                  
                  .image{
                     height: 100%;
                     width: 100%;
                  }
                  
                  .content{
                     height: 160px;
                     display: flex;
                     flex-direction: column;
                  }
                  
                  .words-container{
                     margin-left: 16px;
                     margin-right: 16px;
                     height: inherit;
                     display: flex;
                     justify-content: center;
                     padding-top: 8px;
                     padding-bottom:8px;
                  }
                  
                  .words{
                     font-weight: 400;
                     color: #000000;
                     text-transform: lowercase;
                     line-height: 150%;
                     font-size: 16px;
                     text-align: center;
                     align-self: center;
                     overflow: hidden;
                     display: -webkit-box;
                     -webkit-line-clamp: 3;
                     -webkit-box-orient: vertical;
                  }
                  
                  .title{
                     font-weight: 800;
                     font-size: 16px;
                     align-self: flex-end;
                  }
                  
                  .footer{
                     display: flex;
                     justify-content: space-between;
                     padding-left: 16px;
                     padding-right: 16px;
                  }
                  
                  .credit-container{
                     align-self: flex-end;
                     color: #636363;
                     letter-spacing: 0.1em;
                     font-size: 12px;
                     text-transform: uppercase;
                     font-weight: 500;
                  }
                  
                  .unsplash{
                     margin-right: 8px;
                  }

                  .author-container{
                     margin-left: 8px;
                  }
                  
                  .author{
                     font-weight: 700;
                  }
                  
                  p{
                     font-family: 'Poppins', sans-serif;
                     margin: 0;
                  }
                  
               </style>
            </head>  
            <body class="container">
               <div class="frame">
                  <div class="image-container">
                  </div>
                  <div class="content">
                  <div class="words-container">
                     <p class="words">
                     ${caption}
                  </p>
                  </div>
                  <div class="footer">
                     <p class="title">
                        arutemashi /.
                     </p>
                     <p class="credit-container">
                        <span class="unsplash">unsplash</span>•<span class="author-container">photo by <span class="author">${photo.user}</span></span>
                     </p>
                  </div>
                  </div>
               </div>
            </body>
         </html>
         `,
         waitUntil: ['load', 'networkidle0']
      });

      const photo_b64 = await fs.readFileSync(path, { encoding: 'base64' });
      // delete files
      await fs.unlinkSync(path);
      return photo_b64;
   } catch (error) {
      throw error;
   }
}

async function tumblr(caption) {
   try {
      let photo = db.photos.get_random_photo();
      const path = `./src/public/drawen/${photo.id}.jpg`;
      const color = '4E4E4E';
      await canvas({
         output: path,
         html: `
         <html lang="en">
            <head>
               <title>Hello!</title>
               <link href="https://fonts.googleapis.com/css?family=Roboto:300i&display=swap" rel="stylesheet">
               <link href="https://fonts.googleapis.com/css?family=Poppins:400,700&display=swap" rel="stylesheet">
               <style>
                  .image {
                  height: calc(100% - 48px);
                  width: inherit;  
                  background: url("${photo.urls.regular}&monochrome=${color}");
                  background-size: cover;
                  background-position: center;
                  display: flex;
                  justify-content: center;
                  align-items: flex-end;
                  }
                  
                  .container{
                  height:720px;
                  width: 1080px;
                  display: flex;
                  flex-direction: column;
                  margin: 0 !important;
                  }
                  
                  p {
                  font-family: 'Roboto', sans-serif;
                  text-align: center;
                  font-size: 16px;
                  color: #ffd21f;
                  }
                  
                  p.words{
                  margin-bottom: 48px; 
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 3;
                  -webkit-box-orient: vertical;
                  }
                  
                  p.title{
                  font-family: 'Poppins', sans-serif;
                  font-weight: 700;
                  opacity: 0.5;
                  color: white;
                  }
                  
                  .credit-container{
                  background: black;
                  display: flex;
                  justify-content: space-between;
                  height: 48px;
                  align-items: center;
                  padding: 0 16 0 16;
                  }
                  
                  .unsplash-container{
                  opacity: 0.5;
                  color: white;
                  }
                  
                  p span{
                  padding-left: 5px;
                  padding-right: 5px;
                  background: rgba(0, 0, 0, 0.2);
                  }
               </style>
            </head>  
            <body class="container">  
               <div class="image">
                  <p class="words">
                  <span>
                     ${caption}
                  </span>
                  </p>
               </div>
               
               <div class="credit-container">
                  <p class="title">
                  arutemashi /.
                  </p>
                  
                  <p class="unsplash-container">
                        <span class="unsplash">unsplash</span>•<span class="author-container">photo by <span class="author">${photo.user}</span></span>
                     </p>
                  </div>
               </div>
            </body>
         </html>
         `,
         waitUntil: ['load', 'networkidle0']
      });

      const photo_b64 = await fs.readFileSync(path, { encoding: 'base64' });
      // delete files
      await fs.unlinkSync(path);
      return photo_b64;
   } catch (error) {
      throw error;
   }
}

async function get(selector, caption) {
   try {
      switch (selector) {
         case '/polaroid':
            return await polaroid(caption);
            break;
         case '/tumblr':
            return await tumblr(caption);
            break;
      }
   } catch (error) {
      throw error;
   }
}
export default { polaroid, tumblr, get };
