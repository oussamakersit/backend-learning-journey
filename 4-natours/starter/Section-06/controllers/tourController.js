/* eslint-disable prettier/prettier */
const Tour = require('../models/tourModel');

// exports.aliasTopTour = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
//   next();
// };

exports.getTop5Cheap = async (req, res) => {
  try {
    const tours = await Tour.find()
      .sort('-ratingsAverage price')
      .limit(5)
      .select('name price ratingsAverage summary difficulty');

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllTours = async (req, res) => {
  // An empty find() will return all documents in our targeted collection
  try {
    console.log(req.query);

    //? Build the Query
    // 1-A) Basic Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1-B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // MongoDb Query { difficulty: 'easy', duration: { $gte: '5' } }
    // req.query Query { difficulty: 'easy', duration: { gte: '5' } } | Here we missies ($) sign
    // gte, gt, lte, lt

    let query = Tour.find(JSON.parse(queryStr));
    // console.log(queryStr);

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query = query.sort(sortBy);
      // sort('price ratingsAverage)
    } else {
      // Default sorting by max Group Size (You can sort by anytype you want)
      query = query.sort('-maxGroupSize');
    }
    // To sort in descending order, add a minus sign (-) before the query parameter value: 127.0.0.1:3000/api/v1/tours?sort=-price
    // For ascending order, pass the parameter normally without a minus sign: 127.0.0.1:3000/api/v1/tours?sort=price

    // 3) Limiting or projection
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
      // Here we exclude the __v from the default value (In the context of APIs, especially when working with MongoDB and Mongoose (the Node.js ODM for MongoDB), __v is a field automatically added to documents)
    }

    // 4) Pagination
    const page = Number(req.query.page) || 1;
    const limit = req.query.limit || 100;
    const skip = (page - 1) * limit;

    // page=2&limit=10, 1-10, page 1, 11-20 page 2, 21-30 page 3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    //? Execute the Query
    const tours = await query;

    // const query = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // Send Response
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 'Fail',
      err: err,
    });
  }
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  try {
    // Tour.findOne( { _id: req.params.id })
    const getTour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'Success',
      data: {
        tour: getTour,
      },
    });
  } catch (err) {
    res.status(401).json({
      status: 'Fail',
      err: err.messagae,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // Old way to create and save new file
    // const newtour = new Tour({});
    // newtour.save();

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      data: {
        message: 'Invalid data sent',
        err: err.message,
      },
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      data: {
        message: 'Invalid data sent',
        err: err.message,
      },
    });
  }
};

exports.deleteTour = async (req, res) => {
  await Tour.findOneAndDelete({ _id: req.params.id });
  try {
    // 204 = no content
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      data: {
        err: err.message,
      },
    });
  }
};
