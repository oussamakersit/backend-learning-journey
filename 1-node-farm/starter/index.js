const fs = require("fs");
const http = require("http");

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

const server = http.createServer((req, res) => {
  console.log(res);
  res.end("Hello from the server!!");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening at port 8000");
});
