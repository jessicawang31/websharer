import fetch from 'node-fetch';

import parser from 'node-html-parser';

// Fix cross-site scripting attack vulnerabilities
const escapeHTML = str => String(str).replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));


async function getURLPreview(url){
  // TODO: Copy from your code for making url previews in A2 to make this 
  // a function that takes a url and returns an html string with a preview of that html
  // need try catch
  // html parser start
  try {
    // fetch url contents
    console.log(url);
    const response = await fetch(url);
    console.log(response);
    const pageText = await response.text();

    // parse html
    const htmlPage = parser.parse(pageText);

    // all meta tags
    const metaTags = htmlPage.querySelectorAll("meta");
    // og:url, if missing use the one from query
    const ogUrl = metaTags.find(tag => tag.getAttribute("property") === "og:url")?.getAttribute("content") || url;
    // og:title, if missing use inner <title> tag, if that's missing use url
    const ogTitle = metaTags.find(tag => tag.getAttribute("property") === "og:title")?.getAttribute("content") ||
                    htmlPage.querySelector("title")?.innerText || url;
    // og:image
    const ogImg = metaTags.find(tag => tag.getAttribute("property") === "og:image")?.getAttribute("content");
                  // added attribute as per the kyle thayer web page
                  // htmlPage.querySelector('img')?.getAttribute('src');
        
    // og:description
    const ogDes = metaTags.find(tag => tag.getAttribute("property") === "og:description")?.getAttribute("content");
                  // htmlPage.querySelector('p')?.innerText;

    // creative component, added meta tag
    // og:type
    const ogType = metaTags.find(tag => tag.getAttribute("property") === "og:type")?.getAttribute("content");


    // missing open graph information 
    // information needs to be put in preview box instead of a string like done in lecture3
    let htmlReturn = `<div style="border: 1px solid; max-width: 300px; padding: 3px; text-align: center; background-color: #ffcce6;">`;

    // for url and title, makes title a clickable to url link
    htmlReturn += `<a href="${ogUrl}"><p><strong>${escapeHTML(ogTitle)}</strong></p></a>`;

    // only if these exists, i.e. don't put para tags with nothing inside
    if (ogDes) {
      htmlReturn += `<p>${escapeHTML(ogDes)}</p>`; // para. for description
    }
    if (ogImg) {
      htmlReturn += `<img src="${ogImg}" alt="Preview Image" style="max-width: 270px; max-height: 200px;" />`; // img for image
    }
  
    // added og:type
    if (ogType) {
      htmlReturn += `<p>Type: ${escapeHTML(ogType)}</p>`;
    }

    htmlReturn += `</div>`; // close

    // send html response
    // res.type("html");
    // res.send(htmlReturn);
    return htmlReturn;
  } catch (err) {
    console.log(err);
    // res.status(500).json({"status": "error", "error": err});
  }
}

export default getURLPreview;