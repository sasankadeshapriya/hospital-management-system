const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const router = express.Router();

router.post('/', inventoryController.addInventoryItem);
router.get('/', inventoryController.getInventoryItems);
router.get('/expired', inventoryController.getExpiredInventoryItems);
router.get('/:id', inventoryController.getInventoryItemByID);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id',inventoryController.deleteItem )

module.exports = router;