const { response } = require("express");
const express = require("express")
const router = express.Router();
const {allBatches,createBatches} = require("../controllers/BatchesController")
router.get('/batches',allBatches)
router.post('/batch',createBatches)
module.exports = router