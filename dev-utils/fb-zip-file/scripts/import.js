import JSZip from "jszip";
import fs from "fs";
import { isPrimitive } from "util";

const fbZipLocation = process.env.FB_ZIP_LOCATION;

fs.readFile(fbZipLocation, function(err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
        let structure = {};
        const files = Object.keys(zip.files).sort();
        for ( const f in files  ) {
            const key = files[f];
            const fragments = key.split("/");
            const thisFile = zip.files[key];
            if (thisFile['dir'] ) {
                if ( fragments.length === 2 ) {
                    structure[fragments[0]] = {files: []}
                } else if ( fragments.length === 3 ) {
                    structure[fragments[0]][fragments[1]] = { files: []}
                } else if ( fragments.length === 4 ) { 
                    structure[fragments[0]][fragments[1]][fragments[2]] = { files: [] }
                }
            } else {
                if ( fragments.length === 2 ) {
                    structure[fragments[0]]['files'].push( fragments[1] );
                } else if ( fragments.length === 3 ) {
                    structure[fragments[0]][fragments[1]]['files'].push(fragments[2] );
                } else if ( fragments.length === 3 ) { 
                    structure[fragments[0]][fragments[1]][fragments[2]]['files'].push(fragments[3] );
                }
            }
        }
        console.log(structure);
    });
});
