import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id });

    if (!doc) {
      return next(new ApiError("No document Found With That ID", 404));
    }

    // await doc.deleteOne();
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } //to return document after update not before, if this doesn't exist it will return the document before update
    );
    if (!document) {
      return next(
        new ApiError(`No document found for this id: ${req.params.id}`, 404)
      );
    }

    // Trigger "save" event when update document
    document.save();
    res.status(201).json({ data: document });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      data: doc,
    });
  });
const getOneById = (Modal, populationOpts) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    // 1) build query
    let query = Modal.findById(id);
    if (populationOpts) {
      query = query.populate(populationOpts);
    }
    //2) execute query
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document found for this id: ${id}`, 404));
    }

    res.status(200).json({
      data: document,
    });
  });

const getAll = (Modal, searchModal) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }
    const documentsCounts = await Modal.countDocuments();
    const apiFeatures = new ApiFeatures(Modal.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(searchModal)
      .limitFields()
      .sort();
    // .populate({ path: "category", select: "name _id" });

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res.status(200).json({
      results: documents.length,
      paginationResult,
      data: documents,
    });
  });

export default { deleteOne, updateOne, createOne, getOneById, getAll };
