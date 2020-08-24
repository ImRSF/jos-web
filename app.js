const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MssqlStore = require("connect-mssql")(session);
const pageNotFound = require("./controllers/pageNotFound");
const database = require("./util/database");
const utils = require("./util/globals");
const crypto = require("crypto");
const multer = require("multer"); 

const app = express();

const fileStorageMultiple = multer.diskStorage({ 
  destination: (req, file, cb) => {
    cb(null, "data/files");
  },
  filename: (req, file, cb) => {
    cb(null, utils.generateFileName() + "-" + file.originalname);
  },
  
});

const fileStorageAccount = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/files");
  },
  filename: (req, file, cb) => {
    cb(null, utils.generateFileName() + "-" + file.originalname);
  } 
});

const fileFilter = (req, file, cb) => {
  if (utils.getSupportedFileTypes().includes(file.mimetype))
   { 
    cb(null, true);
  } else {  
    cb(null, false);
  }  
};

app.set("view engine", "ejs");
app.set("views", "views");

const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");
const miscRoutes = require("./routes/misc");
const statsRoutes = require("./routes/stats");
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorageMultiple, fileFilter: fileFilter }).fields([
    { name: "file-accountImage", maxCount: 1 },
    { name: "file-jobRequest", maxCount: 5 },
    { name: "file-jobOrder", maxCount: 5 }
  ])
);
app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.static(path.join(__dirname, "data/files")));
app.use(express.static(path.join(__dirname, "data/system")));

app.use( 
  session({
    store: new MssqlStore(database.config, {
      table: "tblSession"
    }),
    saveUninitialized: false,
    resave: false, // options are optional
    secret: crypto.randomBytes(8).toString("hex")
  })
);

app.use(authRoutes);
app.use(miscRoutes);
app.use(jobRoutes);
app.use(statsRoutes);
app.use(pageNotFound.get404);

app.listen(3002);
