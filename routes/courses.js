const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courses");

router.get("/", courseController.getAllCourses);
router.get("/new", courseController.getNewCoursePage);
router.post("/", courseController.addNewCourse);
router.get("/:id", courseController.getIndividualPage);
router.get("/:id/edit", courseController.getEditPage);
router.put("/:id", courseController.editCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;