import categoryRoute from "./categoryRoute.js";
import subCategoryRoute from "./subCategoryRoute.js";
import brandsRoute from "./brandRoute.js";
import productsRoute from "./productRoute.js";
import userRoute from "./userRoute.js";
import authRoute from "./authRoute.js";
import reviewRoute from "./reviewRoute.js";
import wishlistRoute from "./wishlistRoute.js";
import addressRoute from "./addressRoute.js";
import couponRoute from "./couponRoute.js";
import cartRoute from "./cartRoute.js";

const mountRoutes = (app) => {
  //Mount Routes
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandsRoute);
  app.use("/api/v1/products", productsRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/cart", cartRoute);
};

export default mountRoutes;
