import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import dbConnection from "./config/database.js";
import categoryRoute from "./routes/categoryRoute.js";
import subCategoryRoute from "./routes/subCategoryRoute.js";
import brandsRoute from "./routes/brandRoute.js";
import productsRoute from "./routes/productRoute.js";
import ApiError from "./utils/apiError.js";
import { globalError } from "./middlewares/errorMiddleware.js";

config({ path: ".env.config" });

//connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandsRoute);
app.use("/api/v1/products", productsRoute);
app.all("*", (req, res, next) => {
  // create error and send it to error handle middleware
  // const err = new Error(
  //   `Can't find this route on the server: ${req.originalUrl}`
  // );
  // next(err.message);
  next(
    new ApiError(`Can't find this route on the server: ${req.originalUrl}`, 404)
  );
});
app.use(globalError); //handle error inside express

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("RUNS");
});

//handle rejection (error) outside express
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION !!!!!!!!");
  console.log(err);
  server.close(() => {
    console.log("Shutting down");
    process.exit(1);
  });
});
