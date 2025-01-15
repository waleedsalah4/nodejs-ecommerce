class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    // 1) Filtering
    const queryStringObj = { ...this.query };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryStringObj[el]);

    //if we want to filter with values of greater then or equal we have to do this
    // {price: {$gte: 50}, ratingsAverage: {$gte: 4}}
    //console.log(queryStringObj); //{ ratingsAverage: { gte: '4.3' } }
    //we don't get the "$" sign so we need to add it

    // 1.1) Advanced filtering
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  paginate(countDocuments) {
    // 2) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const endIndex = page * limit;

    if (limit > 10 || limit < 1) {
      limit = 10;
    }
    // pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);
    //next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;

    return this;
  }

  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      //price || -price
      //mongooseQuery = mongooseQuery.sort(this.queryString.sort);

      //in case we need to to sort with more than one value
      // we set the value in postman like this sort=price,sold
      // but this "price,sold" won't work we need to remove the "," as sort work like this => sort('price sold')
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    // 4) Limiting fields
    if (this.queryString.fields) {
      // title,ratingAverage,imageCover,price
      const fields = this.queryString.fields.split(",").join(" ");
      // title ratingAverage imageCover price
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v"); //exclude "__v"
      // when you but '-' before field you eliminate it
    }
    return this;
  }

  search(modalName) {
    // 5) Search
    if (this.queryString.keyword) {
      //   console.log(this.queryString);
      const keyword = this.queryString.keyword.replace(
        /[-\/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );
      let query = {};
      if (modalName === "Products") {
        query.$or = [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      //$options: "i" make it the same incase i write "men" or "MEN" not case sensitive
      this.mongooseQuery = this.mongooseQuery.find(query);
      // search in all products title and description that may have this keyword and return these products
    }
    return this;
  }
}

export default ApiFeatures;
