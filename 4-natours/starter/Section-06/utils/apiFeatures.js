class APIFeatures {
  // this.queryString receives `req.query` from the controller
  // Example: { difficulty: 'easy', 'duration[gte]': '5', page: '2' }

  constructor(query, queryString) {
    this.query = query; // Comes from Mongoose (e.g., Tour.find())
    this.queryString = queryString; // Comes from Express (req.query)
  }

  filter() {
    //? Build the Query
    // 1-A) Basic Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1-B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // MongoDb Query { difficulty: 'easy', duration: { $gte: '5' } }
    // req.query Query { difficulty: 'easy', duration: { gte: '5' } } | Here we missies ($) sign
    // gte, gt, lte, lt

    // Note
    //? FIX: Don't hardcode Tour.find(). Use this.query to make it reusable for other models. Also return 'this' to allow method chaining (e.g., features.filter().sort())

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = query.sort(sortBy);
      // sort('price ratingsAverage)
    } else {
      // Default sorting by max Group Size (You can sort by anytype you want)
      this.query = this.query.sort('-maxGroupSize');
    }

    // To sort in descending order, add a minus sign (-) before the query parameter value: 127.0.0.1:3000/api/v1/tours?sort=-price
    // For ascending order, pass the parameter normally without a minus sign: 127.0.0.1:3000/api/v1/tours?sort=price

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
      // Here we exclude the __v from the default value (In the context of APIs, especially when working with MongoDB and Mongoose (the Node.js ODM for MongoDB), __v is a field automatically added to documents)
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = this.queryString.limit || 100;
    const skip = (page - 1) * limit;

    // page=2&limit=10, 1-10, page 1, 11-20 page 2, 21-30 page 3
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
