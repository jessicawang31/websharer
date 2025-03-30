import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get("/preview", async (req, res, next) => {
    try {
      // get url
        const url = req.query.url;
        const previewHTML = await getURLPreview(url);
    
        res.type("html");
        res.send(previewHTML);
      } catch (err) {
        res.type("html");
        console.log(err);
        res.status(500).send("Error Loading" + err);
      }
});  

export default router;