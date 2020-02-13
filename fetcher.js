//6:00

// Implement a small command line node app called fetcher.js which should take a URL as a command-line argument as well as a local file path and download the resource to the specified path.
// Upon completion, it should print out a message like Downloaded and saved 1235 bytes to ./index.html.

// require 'request', 'fs',
const request = require("request");
const fs = require("fs");
const readline = require("readline");

// ** NOW: using this to query the user if there's file with same name
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Read process.argv and get: 1- the URL; 2- local file to save
const [URL, saveFile] = process.argv.slice(2, 4);

// Create server connection
request(URL, (error, response, body) => {
  // console.log("error:", error);
  // console.log("statusCode:", response && response.statusCode);
  // console.log(`body will be saved to ${saveFile}`);

  // ----------------------------------------------
  // ** NOW: I have to check if there's a file with same name already

  // if there's a file:

  const writeToFile = file => {
    fs.writeFile(file, body, "utf8", () => {
      let stats = fs.statSync(file);
      console.log(`Downloaded and saved ${stats.size} bytes to ${file}`);
      // let stats = fs.Stats(saveFile);
      // console.log("TCL: stats", stats);
    });
  };

  fs.access(saveFile, err => {
    if (!err) {
      // if there's no error the file exists and we ask if user wants to rewrite
      rl.question(
        `The file ${saveFile} already exists. Do you want to overwrite it? Y or N ?\n`,
        answer => {
          if (answer.trim().toLowerCase() === "y") {
            console.log(`The file ${saveFile} will be overwritten.`);
            writeToFile(saveFile);
            rl.close();
          } else {
            rl.question(
              `Please specify a new filename and path:  `,
              newFileName => {
                writeToFile(newFileName);
                rl.close();
              }
            );
          }
        }
      );
    } else {
      writeToFile(saveFile);
    }
    // console.log(`${saveFile} ${err ? "does not exist" : "exists"}`);
  });
});
