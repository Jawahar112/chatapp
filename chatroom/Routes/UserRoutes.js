import {Login,getmessages} from '../Controllers/usercontroller.js'
import { jwtMiddleware } from '../Middlewares/valdaions/jwtvalidation.js';
import express from 'express'
 const Router = express.Router();
Router.route("/login").post(Login);
Router.route("/get/messages").get(
  jwtMiddleware,
 getmessages
)
export default Router
