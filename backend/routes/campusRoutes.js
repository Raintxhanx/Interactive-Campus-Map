// routes/campusRoutes.js
const express = require('express');
const router = express.Router();
const kampusController = require('../controller/campusController');

// READ
router.get('/kampus', kampusController.getAll);
router.get('/cari_kampus', kampusController.search);

// CREATE
router.post('/add_kampus', kampusController.add);

// 🔥 UPDATE
router.put('/update_kampus/:id', kampusController.update);

// 🔥 DELETE
router.delete('/delete_kampus/:id', kampusController.remove);

module.exports = router;
