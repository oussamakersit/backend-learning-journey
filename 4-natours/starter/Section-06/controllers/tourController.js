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

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'Success',
    // data: {
    //   tour: newTour,
    // },
  });
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
