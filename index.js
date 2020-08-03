// fs and http are core modules that are included in node 

//file system
 
const fs = require("fs");
//http 

const http = require("http");

//url

const url = require("url");

//each time someone opens a page on our server get acces to the request and response objects

//method of fs
//dirname is basically the home folder
//uf8 returns a file instead of a buffer
const json = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");

//JSON.parse takes in the json string and returns a object
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {
    //console.log("Someone did access the serve!");

    //console.log(req)
    const pathName = url.parse(req.url, true).pathname;

    
    const id = url.parse(req.url, true).query.id;
    

    //PRODUCT OVERVIEW
   if (pathName === "/products" || pathName === "/") {

      //Headers are small messages sent with the request to let it Know what kind of data is being passed.

    // 200 for ok  content type is html

    res.writeHead(200, { "Content-Type" : "text/html"});
    
    fs.readFile(`${__dirname}/templates/template-overview.html`, "utf-8", (err, data) => {
            let overviewOutput = data
        //we only want to read the card template one the overview tamplate has been read  basically to created a sequence "LOOP". 

        fs.readFile(`${__dirname}/templates/template-card.html`, "utf-8", (err, data) => {
            
           const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join("")
        //  console.log(cardsOutput)
            overviewOutput = overviewOutput.replace("{%CARDS%}", cardsOutput);

           res.end(overviewOutput);
        });
    });

   }

   //LAPTOP DETAIL
   else if (pathName === "/laptop" && id < laptopData.length) {
    
    res.writeHead(200, { "Content-Type" : "text/html"});
    
    fs.readFile(`${__dirname}/templates/template-laptop.html`, "utf-8", (err, data) => {
        const laptop = laptopData[id];
        const output = replaceTemplate(data, laptop);
        res.end(output)
    });
   }
   //Images

   //irregular expression to find image extension 
   else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
       fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
        res.writeHead(200, { "Content-Type" : "image/jpg"});
        res.end(data);
       })
   }
   //URL NOT FOUND
   else {
    res.writeHead(404, { "Content-Type" : "text/html"});
    
    res.end("404 Page Not Found!")
   }
    
}); 

//tells the server to listen on a certain port or ip address

server.listen(3000, "127.0.0.1", () => {
    console.log("Listening for request now!")
})

function replaceTemplate(originalHtml, laptop) {
    let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
         output = output.replace(/{%IMAGE%}/g, laptop.image);
         output = output.replace(/{%PRICE%}/g, laptop.price);
         output = output.replace(/{%SCREEN%}/g, laptop.screen);
         output = output.replace(/{%CPU%}/g, laptop.cpu);
         output = output.replace(/{%STORAGE%}/g, laptop.storage);
         output = output.replace(/{%RAM%}/g, laptop.ram);
         output = output.replace(/{%DESCRIPTION%}/g, laptop.description); 
         output = output.replace(/{%ID%}/g, laptop.id);
         return output;
};



