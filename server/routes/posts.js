const express = require("express");
const router = express.Router();

const multer = require("multer");

require("dotenv").config();

const { storage, displayImage, getAllFiles } = require("../util/db");
const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  return res.json();
});

router.get("/files", (req, res) => {
  getAllFiles(req, res);
});

router.get("/images/:filename", (req, res) => {
  displayImage(req, res);
});

module.exports = router;
