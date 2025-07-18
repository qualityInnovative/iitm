/* This is a Node.js application that sets up an Express server to handle HTTP requests. It imports
necessary modules such as `path`, `express`, `body-parser`, `express-session`, and custom modules
such as `errorController`, `authenticateLogin`, `homeRoute`, `aboutRoutes`, `formRoutes`,
`admissionRoutes`, `academicRoutes`, `campusRoutes`, `placementsRoutes`, `communityRoutes`,
`newsRoutes`, `notificationRoutes`, `eventRoutes`, `authRoutes`, `adminRoutes`, and `authenticate`.
It sets up middleware for parsing form data, serving static files, and handling sessions. It also
sets up routes for different pages and resources. Finally, it starts the server and handles
application shutdown. */
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
// const compression = require("compression");

const errorController = require("./controllers/error");
const authenticateLogin = require("./utils/middlewareAuth");

const logger = require("./utils/logger");

const app = express();

// Setting view engine and views folder
app.set("view engine", "pug");
app.set("views", "views");

// app.use(compression()); //Compress all routes

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // for JSON body
app.use(express.urlencoded({ extended: true })); //
app.use(express.static(path.join(__dirname, "public")));
app.set('trust proxy', 1);
// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, //1 week
  })
);

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const suspicious = /select|sleep|union|--|\/\*/i.test(req.originalUrl + JSON.stringify(req.body));
  logger.info(`IP: ${ip} | ${req.method} ${req.originalUrl}`);
  if (suspicious) {
    logger.warn(`Suspicious request from ${ip}: ${req.method} ${req.originalUrl}`);
  }

  next();
});



const homeRoute = require("./routes/home");
const aboutRoutes = require("./routes/about");
const formRoutes = require("./routes/forms");
const admissionRoutes = require("./routes/admissions");
const academicRoutes = require("./routes/academics");
const campusRoutes = require("./routes/campus");
const placementsRoutes = require("./routes/placements");
const communityRoutes = require("./routes/community");
const aqar2223Routes = require("./routes/aqar-22-23");
const newsRoutes = require("./routes/news");
const notificationRoutes = require("./routes/notifications");
const eventRoutes = require("./routes/events");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const authenticate = require("./controllers/authenticate");
const aqarRoutes = require("./routes/aqar");
const aqar23= require("./routes/aqar-2023-24")

app.use(homeRoute);
app.use("/about", aboutRoutes);
app.use("/aqar", aqarRoutes); 
app.use(formRoutes);
app.use("/admissions", admissionRoutes);
app.use("/academics", academicRoutes);
app.use("/campus", campusRoutes);
app.use("/placements", placementsRoutes);
app.use("/community", communityRoutes);
app.use("/community", newsRoutes);
app.use("/aqar-22-23", aqar2223Routes);
app.use("/aqar-2023-24",aqar23)

app.use(notificationRoutes);
app.use(eventRoutes);
app.use(authRoutes);
app.use("/cms", authenticateLogin); // Securing admin routes
app.use(adminRoutes);
app.use(authenticate);
app.use(errorController.get404);

const server = app.listen(8080);

// Handle application shutdown
process.on("SIGINT", () => {
  console.log("Stopping server...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});
