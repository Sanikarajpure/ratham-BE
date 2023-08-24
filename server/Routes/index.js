const express = require("express");
const authRoute = require("./auth.route");
const sessionsRoute = require("./session.route");

const router = express.Router();

const routesIndex = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/session",
    route: sessionsRoute,
  },
];

routesIndex.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
