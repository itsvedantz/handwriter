const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: false }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://imvedant22:blackdevil22@handwriter.o6fgoac.mongodb.net/?retryWrites=true&w=majority&appName=handwriter',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Create a User schema
const User = mongoose.model(
  'User',
  new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String }
  })
);

// Configure session middleware
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '142457715367-l2kd3asf8jc670fl8bbotfc3lqtljnr1.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Configure local strategy for email/password authentication
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/home.html');
});

// Define authentication routes
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home.html',
    failureRedirect: '/index.html'
  })
);

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email: email, password: hashedPassword });
    await newUser.save();
    res.redirect('/index.html');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/index.html' }),
  (req, res) => {
    // Successful authentication, redirect to the tool page
    res.redirect('/home.html');
  }
);

// Define a middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/home.html');
}

// Protect the login page
app.get('/home.html', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'home.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
