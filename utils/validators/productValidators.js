import slugify from "slugify";
import { check, body } from "express-validator";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { CategoryModel } from "../../models/categoryModel.js";
import { SubCategoryModel } from "../../models/subCategoryModel.js";

export const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),

  // SubCategoryModel.find({_id: { $exists: true, }} return all documents in db with ids (id must exist)

  //{ $exists: true, $in: subcategoriesIds } match this (subcategoriesIds) with ids returned from db and
  // match ids from the db with the ones in "subcategoriesIds"
  /*

ex: 
10 in db
2 items in subcategoriesIds
{ $exists: true, $in: subcategoriesIds }
 if one match will return 1 if two matches will return the two ids
------
db.inventory.find( { qty: { $exists: true, $nin: [ 5, 15 ] } } )
This query will select all documents in the inventory collection where the qty field exists and its value does not equal 5 or 15.
*/

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((subcategoriesIds) =>
      SubCategoryModel.find({
        _id: { $exists: true, $in: subcategoriesIds },
      }).then((result) => {
        //incase subcategoriesIds are correct and exist in db the result variable expected to be an array of these (subcategoriesIds) ids
        if (result.length < 1 || result.length !== subcategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategories Ids`));
        }
      })
    )
    .custom((val, { req }) =>
      SubCategoryModel.find({ category: req.body.category }).then(
        (subcategories) => {
          //subcategories => subcategories that belongs to this category (req.body.category )
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          // check if subcategories ids in db include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validationMiddleware,
];

export const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validationMiddleware,
];

export const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationMiddleware,
];

export const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validationMiddleware,
];
