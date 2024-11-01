const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const router = express.Router();

router.get('/', inventoryController.getInventoryItems);
router.get('/:id', inventoryController.getInventoryItemByID);
router.put('/:id', inventoryController.updateInventoryItem);

module.exports = router;