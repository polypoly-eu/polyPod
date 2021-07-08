import JSZip from "jszip";
import fs from "fs";

const fbZipLocation = process.env.FB_ZIP_LOCATION;

fs.readFile(fbZipLocation, function(err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
        console.log(zip);
    });
});
