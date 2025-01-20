import multer from "multer";
import ApiError from "../apiError.js";
import sharp from "sharp";
import asyncHandler from "express-async-handler";

//NOTE
/*
MULTER STORAGE
* DiskStorage: Doesn't store the image as buffer but store it directly as a file in your file system 
- use incase you won't make image processing in images before store

* MemoryStorage: store the image as buffer 
 - use incase you need to make some image processing in images before store

*/

// 1- DiskStorage engine
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    // const ext = file.mimetype.split("/")[1];
    const fileName = `${new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname}`; //originalname=> image.jpg
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, fileName);
  },
});
*/

// 2- Memory Storage engine
const storage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  const supportedFormats = [
    "jpeg",
    "jpg",
    "png",
    "webp",
    "avif",
    "tiff",
    "gif",
    "svg",
  ];
  const isImageSupported = supportedFormats.some(
    (format) => file.mimetype.split("/")[1] === format
  );
  if (isImageSupported) {
    cb(null, true);
  } else {
    cb(new ApiError("Image format is not supported", 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: multerFilter });
export const uploadCategoryImage = upload.single("image");

export const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("No file uploaded", 400));
  }
  const fileName = `${new Date().toISOString().replace(/:/g, "-")}-${req.file.originalname.split(".")[0]}.webp`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("webp")
    .webp({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);

  //to save the image path in db
  req.body.image = fileName;

  next();
});
