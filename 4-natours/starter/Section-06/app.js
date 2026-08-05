const fs = require('fs');

const express = require('express');
const app = express();

// Built-in Middleware
app.use(express.json());

// Reading local Data file
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simplef.json`));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  // console.log(req.params);
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const updateTour = (req, res) => {
  // 1. Get the tour ID from the URL and convert it to a number
  const tourId = Number(req.params.id);

  // 2. Find the index of the tour inside the tours array
  const tourIndex = tours.findIndex((tour) => tour.id === tourId);

  // 3. Return an error if the tour does not exist
  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with this ID',
    });
  }

  // 4. Merge the existing tour data with the new data from the request body
  const updatedTour = {
    ...tours[tourIndex],
    ...req.body,

    // Prevent the user from changing the original tour ID
    id: tours[tourIndex].id,
  };

  // 5. Replace the old tour with the updated tour
  tours[tourIndex] = updatedTour;

  // 6. Save the updated tours array to the JSON file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      // Handle errors that happen while writing the file
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Could not update the JSON file',
        });
      }

      // 7. Send the updated tour back to the client
      res.status(200).json({
        status: 'success',
        data: {
          tour: updatedTour,
        },
      });
    },
  );
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'No tour found with this ID',
    });
  }

  // 204 = no content
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};

// Route handlers

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const PORT = 8000;
app.listen(PORT, '127.0.0.1', () =>
  console.log(`Server is listening on port: ${PORT}...`),
);
