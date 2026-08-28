/* eslint-disable prettier/prettier */
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  // An empty find() will return all documents in our targeted collection
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: 'Success',
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

exports.deleteTour = (req, res) => {
  // 204 = no content
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
