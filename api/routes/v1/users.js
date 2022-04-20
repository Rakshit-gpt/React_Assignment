const express = require("express");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const checkAuth = require("../../middleware/check-auth");

const router = express.Router();

let usersInfo = [];
let articles = [
  {
    id: 1,
    title: "Node js ",
    text: "The API reference documentation provides detailed information about a function or object in Node.js. This documentation indicates what arguments a method accepts, the return value of that method, and what errors may be related to that method. It also indicates which methods are available for different versions of Node.js. This documentation describes the built-in modules provided by Node.js. It does not document modules provided by the community.",
    author: "Rakshit Gupta",
  },
  {
    id: 2,
    title: "React JS",
    text: "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable and easier to debugA Simple Component React components implement a render() method that takes input data and returns what to display. This example uses an XML-like syntax called JSX. Input data that is passed into the component can be accessed by render() via this.props. JSX is optional and not required to use React. Try the Babel REPL to see the raw JavaScript code produced by the JSX compilation step.",
    author: "Ayush Gupta",
  },
  {
    id: 3,
    title: "Cricket",
    text: "Cricket is a bat-and-ball game played between two teams of eleven players each on a field at the centre of which is a 22-yard (20-metre) pitch with a wicket at each end, each comprising two bails balanced on three stumps. The game proceeds when a player on the fielding team, called the bowler, 'bowls' (propels) the ball from one end of the pitch towards the wicket at the other end, with an 'over' being completed once they have legally done so six times. The batting side has one player at each end of the pitch, with the player at the opposite end of the pitch from the bowler aiming to strike the ball with a bat. The batting side scores runs either when the ball reaches the boundary of the field, or when the two batters swap ends of the pitch, which results in one run.",
    author: "Ankit Yadav",
  },
];

// All routes here start with '/users' already

// get all the blogs data
router.get("/viewarticles", checkAuth, (req, res) => {
  res.send(articles);
});

// register a new user
router.post("/signup", (req, res) => {
  const check = usersInfo.find((user) => user.email == req.body.email);
  if (check) {
    return res
      .status(409)
      .json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      } else {
        req.body.password = hash;

        const newUser = req.body;

        const userId = uniqid();

        const userWithId = {
          id: userId,
          ...newUser,
        };

        const token = jsonwebtoken.sign(
          {
            userName: userWithId.name,
            id: userWithId.id,
          },
        
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );

        usersInfo.push(userWithId);

        return res.status(200).json({
          success: true,
          message: `User with name ${newUser.name} is created`,
          token: token,
        });
      }
    });
  }
});

// Login user
router.post("/login", (req, res) => {
  const check = usersInfo.find((user) => user.email == req.body.email);

  if (check == null) {
    return res.status(401).json({ success: false, message: "Auth failed" });
  }

  bcrypt.compare(req.body.password, check.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    if (result) {
      const token = jsonwebtoken.sign(
        {
          userName: check.name,
          id: check.id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "Auth successful",
        token: token,
      });
    }
  });
});

module.exports = router;