import multer from "multer";
import ApiError from "../utils/apiError.js";

const multerOptions = () => {
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
  return upload;
};

export const uploadSingleImage = (fieldName) =>
  multerOptions().single(fieldName);
