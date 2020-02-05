const crypto = require("crypto");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");

require("dotenv").config();

let gfs;

exports.connectMongoDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(mongoInstance => {
      console.log("Connected to MongoDB");

      gfs = Grid(mongoInstance.connection.db, mongoose.mongo);
      gfs.collection("uploads");
    })
    .catch(err => {
      console.error(err);
    });
};

exports.storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

exports.getAllFiles = (req, res) => {
  gfs.files.find({}).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "Files don't exist" });
    } else {
      return res.json(files);
    }
  });
};

exports.displayImage = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ error: "File doesn't exist" });
    }

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  });
};
