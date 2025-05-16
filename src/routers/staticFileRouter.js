const express = require("express");
const staticRouter = express.Router();
staticRouter.use(express.static('uploads/users/picture'));

module.exports = staticRouter;