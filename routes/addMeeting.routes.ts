import express from "express";
const router = express.Router();
const addMeeting_controller = require("../controllers/addMeeting.controller");

router.post("/createMeeting", addMeeting_controller.createMeeting);
// router.get("/getSelectedFAQPageDetails/:id", addMeeting_controller.getSelectedFAQPageDetails);
// router.patch("/updateFAQPageDetails/:id", addMeeting_controller.updateFAQPageDetails);
// router.get("/getAllFAQs", addMeeting_controller.getAllFAQs);
// router.delete("/deleteSelectedFAQPage/:id", addMeeting_controller.deleteSelectedFAQPage);

export { router as addMeetingRoutes };