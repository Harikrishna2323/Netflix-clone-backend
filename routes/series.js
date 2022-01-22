const router = require("express").Router();
const Series = require("../models/Series");
const verify = require("../utils/verifyToken");
const Movie = require("../models/Movie");

//CREATE
router.post("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    const newSeries = new Series(req.body);
    try {
      const savedSeries = await newSeries.save();
      res.status(201).json(savedSeries);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//UPDATE
router.put("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Series.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedSeries);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      await Series.findByIdAndDelete(req.params.id);
      res.status(200).json("The series has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//GET
router.get("/find/:id", verify, async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    res.status(200).json(series);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET RANDOM
router.get("/random", verify, async (req, res) => {
  const type = req.query.type;

  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }

    res.status(200).json(movie);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const series = await Series.find();
      res.status(200).json(series.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You are not allowed!");
  }
});

//GET ALL SERIES
router.get("/isseries", verify, async (req, res, next) => {
  if (req.user.isAdmin) {
    try {
      // const series = await Movie.aggregate([{ $match: { isSeries: true } }]);
      const series = await Series.find({ isSeries: true });
      console.log(series.length);
      res.status(200).json({
        series,
        length: series.length,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
});

module.exports = router;
