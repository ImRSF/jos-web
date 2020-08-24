const express = require('express');
const jobRequestController = require('../controllers/jobRequests');
const jobOrderController = require('../controllers/jobOrders');
const jobReviewController = require('../controllers/jobReviews');

const router = express.Router();

// GET Requests
router.get('/jobs/get-requestNumber', jobRequestController.getRequestNumber);
router.get('/jobs/job-requests/:option', jobRequestController.getJobRequestsForAttachment);
router.get('/jobs/job-requests', jobRequestController.getJobRequests);  
router.get('/jobs/job-request', jobRequestController.getJobRequest);
router.get('/jobs/job-orders', jobOrderController.getJobOrders);
router.get('/jobs/job-order/:mode/:rowJoNum', jobOrderController.getJobOrder); 
router.get('/jobs/job-order-dashboard', jobOrderController.getJobOrderDashboard); 
router.get('/jobs/job-order', jobOrderController.getJobOrderLink); 
router.get('/jobs/JOStatusPerUser', jobOrderController.getJOStatusPerUser); 
router.get('/jobs/job-items', jobOrderController.getJobItems);
router.get('/jobs/job-itemsFromCategories', jobOrderController.getJobItemsFromCategories);
router.get('/jobs/job-reviews', jobReviewController.getJobReviews);
router.get('/jobs/job-review', jobReviewController.getJobReview); 
router.get('/jobs/get-jobOrderForReview', jobReviewController.getJOforReview); 
router.get('/jobs/get-lastJOReviewed', jobReviewController.getLastJOReviewed);

// POST Requests
router.post('/jobs/job-requests', jobRequestController.postJobRequests); 
router.post('/jobs/job-orders', jobOrderController.postJobOrders)  
router.post('/jobs/add-review', jobReviewController.postJobReview);

// MISC Requests
router.post('/jobs/delete/job-requests', jobRequestController.postDeleteJobRequest);
router.post('/jobs/delete/job-orders', jobOrderController.postDeleteJobOrder);
router.post('/jobs/delete/job-item', jobOrderController.postDeleteJobItem);

module.exports = router;       