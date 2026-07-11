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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = data;

const server = http.createServer((req, res) => {
  const urlPathName = req.url;

  // ======= ROOT Route =======
  if (urlPathName === "/" || urlPathName === "overview") {
    res.end("This is the overview");

    // ======= Product Route =======
  } else if (urlPathName === "/product") {
    res.end("This is the product");

    // ======= API Route =======
  } else if (urlPathName === "/api") {
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
