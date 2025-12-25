import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Category from './models/Category.js';
import Subcategory from './models/SubCategory.js';
import Course from './models/Course.js';
import Lesson from './models/Lesson.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Promise.all([
      Category.deleteMany({}),
      Subcategory.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      User.deleteMany({})
    ]);

    console.log('Creating sample data...');
    const cat = await Category.create({ name: 'Music', description: 'Learn musical instruments and theory' });
    const sub = await Subcategory.create({ categoryId: cat._id, name: 'Guitar', description: 'Acoustic & electric guitar lessons' });
    const course = await Course.create({ subcategoryId: sub._id, title: 'Guitar for Beginners', description: 'From zero to chords', level: 'Beginner', certificateAvailable: true });

    const lesson1 = await Lesson.create({ courseId: course._id, title: 'Introduction & Guitar Parts', order: 1, videoUrl: 'https://example.com/video1' });
    const lesson2 = await Lesson.create({ courseId: course._id, title: 'Basic Chords', order: 2, videoUrl: 'https://example.com/video2' });

    course.lessons = [lesson1._id, lesson2._id];
    await course.save();

    const user = await User.create({ name: 'Test User', email: 'test@example.com', password: 'password123' });

    console.log('Seed completed.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
