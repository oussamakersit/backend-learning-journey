const fs = require("fs");
const http = require("http");
const url = require("url");

const PORT = 8000;

// Reading files
const tempOverview = fs.readFileSync("./templates/temp-overview.html", "utf-8");
const tempCard = fs.readFileSync("./templates/temp-card.html", "utf-8");
const tempProduct = fs.readFileSync("./templates/temp-product.html", "utf-8");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{#PRODUCTNAME#}/g, product.productName);
  output = output.replace(/{#IMAGE#}/g, product.image);
  output = output.replace(/{#FROM#}/g, product.from);
  output = output.replace(/{#NUTRIENTS#}/g, product.nutrients);
  output = output.replace(/{#QUANTITY#}/g, product.quantity);
  output = output.replace(/{#PRICE#}/g, product.price);
  output = output.replace(/{#DESCRIPTION#}/g, product.description);
  output = output.replace(/{#ID#}/g, product.id);

  if (!product.organic)
    output = output.replace(/{#NOT_ORGANIC#}/g, "not-organic");

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const { pathname, query } = url.parse(req.url, true);

  // ROOT PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const htmlCards = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{#PRODUCT_CARD#}/, htmlCards);

    res.end(output);

    // PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });

    const product = dataObject[query.id];
    const output = tempProduct.replace(/{#ID#}/g, product);

    res.end(output);

    // API PAGE
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);

    // NOT FOUND PAGE
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end(`<h1>NOT FOUND</h1>`);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Server is listening at port: ${PORT}`);
});
