const express = require("express"); //import express
let uId;
// 1.
const router = express.Router();
// 2.
const loginController = require("../C/login.controller.js");
const userController = require("../C/user.controller.js");
const reviewController = require("../C/review.controller");
const authorController = require("../C/author.controller");
// 3.
//login
router.post("/B/login", loginController.login);
router.get("/B/logout", loginController.logout);

//admin - user's account
router.post("/B/createUser", userController.createUser);

router.get("/B/viewUser", userController.viewUser);

router.post("/B/updateUser", userController.updateUser);

router.post("/B/searchUser", userController.searchUser);

//admin - user's profile
router.post("/B/createUserProfile", userController.createUserProfile);

router.get("/B/viewUserProfile", userController.viewUserProfile);

router.post("/B/updateUserProfile", userController.updateUserProfile);

router.post("/B/searchUserProfile", userController.searchUserProfile);

//reviewer - bid
router.post("/B/bidPaper", reviewController.createBid);

router.post("/B/viewBid", reviewController.viewBid);

router.post("/B/updateBid", reviewController.updateBid);

router.post("/B/deleteBid", reviewController.deleteBid);

router.post("/B/searchBid", reviewController.searchBid);

//reviewer - review

router.post("/B/createReview", reviewController.createReviewRate);

router.post("/B/viewMyReview", reviewController.viewMyReview);

router.post("/B/updateMyReview", reviewController.updateMyReview);

router.post("/B/searchMyReview", reviewController.searchMyReview);

router.post("/B/deleteMyReview", reviewController.deleteMyReview);

router.post("/B/viewOtherReview", reviewController.viewOtherReview);

//reviewer - comments

router.post("/B/CreateComment", reviewController.createComment);

router.post("/B/ViewMyComment", reviewController.viewMyComment);

router.post("/B/updateMyComment", reviewController.updateMyComment);

router.post("/B/deleteMyComment", reviewController.deleteMyComment);

router.post("/B/searchMyComment", reviewController.searchMyComment);

router.post("/B/updateMaxPaperNum", reviewController.updateMaxPaperNum);

//author

router.post("/B/createPaper", authorController.createPaper);

router.get("/B/viewPaper", authorController.viewPaper);

router.post("/B/authorUpdateMyPaper", authorController.updatePaper);

router.post("/B/deleteMyPaper", authorController.deleteMyPaper);

router.post("/B/searchMyPaper", authorController.searchMyPaper);

router.post("/B/viewReviewOnPaper", authorController.viewReviewOnPaper);

router.post("/B/rateOnReview", authorController.rateOnReview);

// 4.
module.exports = router; // export to use in server.js
