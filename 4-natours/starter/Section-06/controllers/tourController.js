/* eslint-disable prettier/prettier */
const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    // data: {
    //   tours: tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);

  res.status(200).json({
    status: 'Success',
    // data: {
    //   tour: tour,
    // },
  });
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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here...',
    },
  });
};

exports.deleteTour = (req, res) => {
  // 204 = no content
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
