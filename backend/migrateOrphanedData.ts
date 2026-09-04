import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Course } from './src/models/Course';
import { Assessment } from './src/models/Assessment';
import { Enrollment } from './src/models/Enrollment';
import { User } from './src/models/User';
import { Feedback } from './src/models/Feedback';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/capacity_connect';

const migrate = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const trainer = await User.findOne({ role: 'trainer' });
    if (!trainer) {
      console.log('No trainer found');
      return;
    }

    const newCourses = await Course.find({ trainerId: trainer._id });
    if (newCourses.length === 0) {
      console.log('No new courses found for trainer');
      return;
    }

    const firstCourseId = newCourses[0]._id;
    const courseIds = newCourses.map(c => c._id.toString());

    // Fix Assessments
    const allAssessments = await Assessment.find();
    let count = 0;
    for (const a of allAssessments) {
      if (!courseIds.includes(a.courseId.toString())) {
        a.courseId = firstCourseId;
        await a.save();
        count++;
      }
    }
    console.log(`Migrated ${count} orphaned assessments to course: ${newCourses[0].title}`);

    // Fix Enrollments
    const allEnrollments = await Enrollment.find();
    count = 0;
    for (const e of allEnrollments) {
      if (!courseIds.includes(e.courseId.toString())) {
        e.courseId = firstCourseId;
        await e.save();
        count++;
      }
    }
    console.log(`Migrated ${count} orphaned enrollments`);

    // Fix Feedbacks
    const allFeedbacks = await Feedback.find();
    count = 0;
    for (const f of allFeedbacks) {
      if (!courseIds.includes(f.courseId.toString())) {
        f.courseId = firstCourseId;
        await f.save();
        count++;
      }
    }
    console.log(`Migrated ${count} orphaned feedbacks`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();
