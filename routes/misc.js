const express = require('express');
const miscController = require('../controllers/misc');
const router = express.Router(); 
 
router.get('/misc/company', miscController.getCompanyList);
router.get('/misc/department', miscController.getDepartmentList);
router.get('/misc/section', miscController.getSectionList);

//router.get('/misc/user-list/:listName', miscController.getUserList);
// Prototype: Refactored version
router.get('/misc/user-list', miscController.getUserList);

router.get('/misc/category', miscController.getCategoryList);
router.get('/misc/categoryOnly', miscController.getCategoryOnly);
// router.get('/misc/categoryItem', miscController.getCategoryItemList);  
router.get('/misc/categoryItem', miscController.getCategoryItem);
router.get('/misc/categoryItemForHardware', miscController.getCategoryItemListForHardware);
router.get('/misc/referenceStatus', miscController.getReferenceStatusList);
router.get('/misc/network-list', miscController.getNetworkList);
router.get('/misc/network', miscController.getNetwork); 
router.get('/misc/system-list', miscController.getSystemList);
router.get('/misc/system', miscController.getSystem);
router.get('/misc/software-list', miscController.getSoftwareList);
router.get('/misc/software', miscController.getSoftware);
router.get('/misc/hardware-list', miscController.getHardwareList);
router.get('/misc/miscellaneous-list', miscController.getMiscellaneousList);
router.get('/misc/miscellaneous', miscController.getMiscellaneous);
router.get('/misc/employee-list', miscController.getEmployeeList);
router.get('/misc/employeeWithWorkstation', miscController.getEmployeeWithWorkstation);
router.get('/misc/getCurrentDate', miscController.getCurrentDate); 
router.get('/misc/user', miscController.getUser); 
router.get('/misc/userById', miscController.getUserById);
router.get('/misc/getApprover', miscController.getApprover);
router.get('/misc/getFileSizeLimit', miscController.getFileSizeLimit);
router.get('/misc/getServerDefaults', miscController.getServerDefaults);
router.get('/misc/getHardwareItemType', miscController.getHardwareItemType);
router.get('/misc/test', miscController.getTestPage); 

router.get("/misc/sync/RMS", miscController.syncRMS);
router.get("/misc/sync/dbHIS", miscController.syncHIS);
router.get("/misc/sync/Alsons_HRIS", miscController.syncHRIS);

router.post('/misc/network', miscController.postNetwork);
router.post('/misc/delete/network', miscController.postDeleteNetwork);
router.post('/misc/software', miscController.postSoftware); 
router.post('/misc/delete/software', miscController.postDeleteSoftware);
router.post('/misc/system', miscController.postSystem);
router.post('/misc/delete/system', miscController.postDeleteSystem);
router.post('/misc/miscellaneous', miscController.postMiscellaneous);
router.post('/misc/delete/miscellaneous', miscController.postDeleteMiscellaneous);
 
module.exports = router;