const Course = require("../models/course");
const {instructors, courseTypes, weekdays, times, semesters, semSansSpace, modules} = require('../config/data');

module.exports = {
    getAllCourses: async (req, res) => {
        try {
            const diffModules = [];
            const courses = await Course.find({}).sort('courseNumber');
            for (let course of courses) {
                diffModules.push(course.module);
            }
            let uniqueModules = [...new Set(diffModules)];
            uniqueModules.sort();
            res.render('courses/courses.ejs', {courses, semesters, uniqueModules, semSansSpace, title: 'All Courses'})
        } catch (err) {
            console.log(err);
            res.render('error', {err, title: 'Error'});
        }
    },
    getNewCoursePage: async (req, res) => {
        try {
            res.render('courses/new.ejs', {instructors, courseTypes, weekdays, times, semesters, modules, title: 'New KoVo Entry'})
        } catch (err) {
            console.log(err);
            res.render('error', {err, title: 'Error'});
        }
    },
    addNewCourse: async (req, res) => {
        try {
            const instrLastName = req.body.instructor.split(',')[0]
            const newCourse = new Course(req.body);
            await newCourse.save();
            newCourse.semesterNoSpace = req.body.semester.replace(/\s+/g, '');
            newCourse.lastName = instrLastName;
            newCourse.objectivesList = req.body.objectives.split('^');
            newCourse.litList = req.body.lit.split('^');
            await newCourse.save();
            console.log(newCourse);
            req.flash('success', 'Successfully added a new course!');
            res.redirect(`/courses`);
        } catch (err) {
            console.log(err);
            req.flash('error', 'Something went wrong!');
            res.render('error', {err, title: 'Error'});
        }
    },
    getIndividualPage: async (req, res) => {
        try {
            const {id} = req.params;
            const course = await Course.findById(id);
            res.render('courses/entry', {course, title: course.courseTitle});
        } catch (err) {
            console.log(err);
            res.render('error', {err, title: 'Error'});
        }
    },
    getEditPage: async (req, res) => {
        try {
            const {id} = req.params;
            const course = await Course.findById(id);
            res.render('courses/edit', {course, instructors, courseTypes, weekdays, times, semesters, modules, title: 'Edit Course'});
        } catch (err) {
            console.log(err);
            res.render('error', {err, title: 'Error'});
        }
    },
    editCourse: async (req, res) => {
        try {
            const {id} = req.params;
            const course = await Course.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
            console.log(`COURSE UPDATED: ${course.courseTitle}`);
            req.flash('success', `Course ${course.courseTitle} successfully updated!`)
            res.redirect(`/courses`);
        } catch (err) {
            console.log(err);
            req.flash('error', 'Something went wrong!');
            res.render('error', {err, title: 'Error'});
        }
    },
    deleteCourse: async (req, res) => {
        try {
            const {id} = req.params;
            const course = await Course.findByIdAndDelete(id);
            console.log(`COURSE DELETED: ${course.courseTitle}`);
            req.flash('success', `Course ${course.courseTitle} successfully deleted!`)
            res.redirect(`/courses`);
        } catch (err) {
            console.log(err);
            req.flash('error', 'Something went wrong!');
            res.render('error', {err, title: 'Error'});
        }
    }
}