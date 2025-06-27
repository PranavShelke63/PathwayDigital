const express = require('express');
const router = express.Router();
const repairJobController = require('../controllers/repairJobController');

router.post('/', repairJobController.createRepairJob);
router.get('/', repairJobController.getRepairJobs);
router.get('/:id', repairJobController.getRepairJobById);
router.put('/:id', repairJobController.updateRepairJob);
router.delete('/:id', repairJobController.deleteRepairJob);
router.post('/upload-condition-images', repairJobController.uploadConditionImages);

module.exports = router; 