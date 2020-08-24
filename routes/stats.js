const express = require('express');
const statController = require('../controllers/statistics');
const router = express.Router(); 
 
router.get('/stat/overview', statController.getOverview);

router.get('/stat/joSummary', statController.getJOSummary);
router.get('/stat/joCategory', statController.getJOCategory);
router.get('/stat/jrSummary', statController.getJRSummary);
router.get('/stat/jrStatistic', statController.getJRStatistic);
router.get('/stat/joStatistic', statController.getJOStatistic);
router.get('/stat/jobsCards', statController.getJobCardValues);
router.get('/stat/jiSummary', statController.getJISummary);
router.get('/stat/reviewStatistic', statController.getReviewStatistic);

router.post('/stat/joSummary', statController.postJOSummary);
router.post('/stat/jrSummary', statController.postJRSummary);

module.exports = router;  