//6:00

// Implement a small command line node app called fetcher.js which should take a URL as a command-line argument as well as a local file path and download the resource to the specified path.
// Upon completion, it should print out a message like Downloaded and saved 1235 bytes to ./index.html.

const request = require("request");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const [URL, saveFile] = process.argv.slice(2, 4);

// Create server connection
request(URL, (error, response, body) => {
  if (error) throw error;

  if (response.statusCode === 200) {
    const writeToFile = file => {
      fs.writeFile(file, body, "utf8", () => {
        let stats = fs.statSync(file);
        console.log(`Downloaded and saved ${stats.size} bytes to ${file}`);
        process.exit();
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
    });
  } else {
    console.log(response.statusCode);
  }
});
