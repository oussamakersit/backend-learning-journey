const fs = require("fs");
const http = require("http");
const url = require("url");

//? ///////////////////////////////
//? Files

// Blocking Synchronously way

// const textInput = fs.readFileSync("./txt/input.txt", "utf8");
// console.log(textInput);

// const textOut = `So this is what we know about: \n${textInput}`;
// fs.writeFileSync(`./txt/newOutput.txt`, textOut);
// console.log("The file has been written");

// const newOutput = fs.readFileSync("./txt/newOutput.txt", "utf8");
// console.log(newOutput);

// const fs = require("fs");
// const http = require("http");

// Non-Blocking Asynchronously way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   if (err) return console.log("Error");

//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(data1);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data2) => {
//       console.log(data2);

//       fs.writeFile("./txt/newFinal.txt", `${data1}\n\n${data2}`, (err) => {
//         console.log("Error while writing file");
//       });
//     });
//   });
// });

//? ///////////////////////////////
//? Server

const tempCard = fs.readFileSync(
  `${__dirname}/templates/temp-card.html`,
  "utf-8",
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/temp-overview.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/temp-product.html`,
  "utf-8",
);

const placeholderChange = (temp, product) => {
  let output = temp.replace(/{#PRODUCTNAME#}/g, product.productName);
  output = output.replace(/{#IMAGE#}/g, product.image);
  output = output.replace(/{#PRICE#}/g, product.price);
  output = output.replace(/{#FROM#}/g, product.from);
  output = output.replace(/{#NUTRIENTS#}/g, product.nutrients);
  output = output.replace(/{#QUANTITY#}/g, product.quantity);
  output = output.replace(/{#DESCRIPTION#}/g, product.description);
  output = output.replace(/{#ID#}/g, product.id);

  if (!product.organic)
    output = output.replace(/{#NOT_ORGANIC#}/g, "not-organic");

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // ======= ROOT Route =======
  if (pathname === "/" || pathname === "overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const htmlCards = dataObj
      .map((el) => placeholderChange(tempCard, el))
      .join("");

    const output = tempOverview.replace("{#PRODUCT_CARD#}", htmlCards);

    // console.log(output);

    res.end(output);

    // ======= Product Route =======
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text-html" });

    const product = dataObj[query.id];
    const output = placeholderChange(tempProduct, product);

    res.end(output);

    // ======= API Route =======
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);

    // ======= NOT FOUND Route =======
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-custom-http-header":
        "Welcome to the backend of KR API Powered by NodeJS",
    });
    res.end("<h1>Page not found!!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening at port 8000");
});
