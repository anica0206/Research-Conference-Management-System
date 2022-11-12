const express = require('express'); //import express

// 1.
const router = express.Router();
// 2.
const loginController = require('../C/login.controller.js');
const userController = require('../C/user.controller.js');
const reviewController = require('../C/review.controller');
// 3.
//login
router.post('/B/login_page', loginController.login);
router.get('/B/logout', loginController.logout);

//admin - user's account
router.post('/B/createUser', userController.createUser);

router.get('/B/viewUser', userController.viewUser);

router.post('/B/updateUser', userController.updateUser);

router.post('/B/searchUser', userController.searchUser);

//admin - user's profile
router.post('/B/createUserProfile', userController.createUserProfile);

//reviewer - bid
router.post('/B/bidPaper', reviewController.createBid);

router.post('/B/viewBid', reviewController.viewBid);

router.post('/B/updateBid', reviewController.updateBid);

router.post('/B/deleteBid', reviewController.deleteBid);

router.post('/B/searchBid', reviewController.searchBid);

//reviewer - review
router.post('/B/createReview', reviewController.createReviewRate);

router.post('/B/viewMyReview', reviewController.viewMyReview);

router.post('/B/updateMyReview', reviewController.updateMyReview);

router.post('/B/searchMyReview', reviewController.searchMyReview);

router.post('/B/viewOtherReview', reviewController.viewOtherReview);

router.post('/B/CreateComment', reviewController.createComment);

router.post('/B/ViewMyComment', reviewController.viewMyComment);

router.post('/B/updateMyComment', reviewController.updateMyComment);

router.post('/B/deleteMyComment', reviewController.deleteMyComment);

router.post('/B/searchMyComment', reviewController.searchMyComment);

// 4. 
module.exports = router; // export to use in server.js
