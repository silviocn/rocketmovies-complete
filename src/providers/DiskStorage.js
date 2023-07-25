const fs = require("fs"); // from Nodejs, to handle documents 
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename( // rename it's not used to rename the file but to change folder
      path.resolve(uploadConfig.TMP_FOLDER, file), // getting file from this folder and
      path.resolve(uploadConfig.UPLOADS_FOLDER, file) // saving file in this folder
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try { // every time you handle with documents it's important to use try/catch if there is an error
      await fs.promises.stat(filePath); // stat is used to check status of the document
    }catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;