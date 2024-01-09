import './config.mjs';
import './db.mjs';
import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
const app = express();
const Review = mongoose.model('Review');
// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  if (req.session.pageVisits) {
    req.session.pageVisits++;
  } else {
    req.session.pageVisits = 1;
  }
  res.locals.count = req.session.pageVisits;
  next();
});

app.get('/', (req, res) => {
  const s = req.query;
  const query = {};
  if (s){
    const { semester, year, professor } = req.query;
    if (semester) {
      if (semester !== "all"){
        query.semester = semester;
      }
    }
    if (year) {
      query.year = year;
    }
    if (professor) {
      query.professor = professor;
    }
  }
  Review.find(query)
    .then((reviews)=>{
      res.render("index", {"reviews": reviews});
    }
    )
    .catch(err => res.status(500).send(err));
});

app.get('/reviews/add', (req, res) => {
  res.render("review-add", {});
});

app.post('/reviews/add', (req, res) => {
  const rev = new Review({
    courseNumber: req.body.courseNumber,
    courseName: req.body.courseName,
    semester: req.body.semester,
    year: req.body.year,
    professor: req.body.professor,
    review: req.body.review,
    sessionId: req.session.id,
  });
  rev.save()
    .then(saved => {
      console.log(saved);
      res.redirect('/');
    })
    .catch(err => res.status(500).send(err));
});

app.get('/reviews/mine', (req, res) => {
  if (req.session.id) {
    Review.find({ sessionId: req.session.id })
      .then(revs => res.render("my-reviews", {"reviews": revs}))
      .catch(err => res.status(500).send(err));
  } else {
    res.send("no seesion Id");
  }
});

app.listen(process.env.PORT || 3000);
