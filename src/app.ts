import express from "express";
import { AppRouter } from "./router/app_router";
const router = AppRouter.getInstance();
import "./controllers/todo.controller";
import "./controllers/user.controller";
class Server {
  app: express.Express = express();

  constructor() {
    this.app.use(express.json());
    this.app.use(router);
    this.app.listen(4000, () => {
      console.log("App is Listening");
    });
  }
}

new Server();
