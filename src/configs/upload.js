const path = require("path"); // in this step I created a folder called tmp
const multer = require("multer"); // library used for uploading
const crypto = require("crypto"); // library used to create a Hash

// creating a temporary folder to receive the document (img) and a folder to keep the documents (img):
const TMP_FOLDER = path.resolve (__dirname, "..", "..", "tmp"); // Using upper case letters because it's a configuration info
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads"); 

const MULTER = {
  storage: multer.diskStorage({ // storage is a property of MULTER
    destination: TMP_FOLDER, // where to send the document
    filename(request, file, callback) { // name of the document
      const fileHash = crypto.randomBytes(10).toString("hex"); // creating a unique name for the document and avoid overlap
      const fileName = `${fileHash}-${file.originalname}`; // final name for the document

      return callback(null, fileName);
    },
  }),
};

module.exports = {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
}