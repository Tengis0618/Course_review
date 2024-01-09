// add your code here!
import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    courseNumber: String,
    courseName: String,
    semester: String,
    year: Number,
    professor: String,
    review: String,
    sessionId: String,
  });
  
mongoose.model('Review', ReviewSchema);
  

// console.log(process.env.DSN)
mongoose.connect(process.env.DSN);

