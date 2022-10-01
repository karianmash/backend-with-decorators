import { Request, Response } from "express";
import {
  Get,
  Controller,
  Use,
  Post,
  Delete,
  BodyValidator,
  Patch,
} from "../decorators";
import { v4 as uid } from "uuid";
import Connection from "../helpers/db";
import { verifyToken } from "../midleware/verify";

const db = new Connection();

@Controller("/todo")
class TodoController {
  @Get("/get_todos")
  @Use(verifyToken)
  async getTodos(req: Request, res: Response) {
    const { recordset } = await db.exec("getTodos");
    res.status(200).json(recordset);
  }

  @Post("/create")
  @BodyValidator("title", "description")
  @Use(verifyToken)
  async addTodo(req: Request, res: Response) {
    const id = uid();
    const { title, description } = req.body;

    await db.exec("insertTodo", { id, title, description });
    res.status(200).json({ message: "Todo added successfully" });
  }

  @Get("/:id")
  @Use(verifyToken)
  async getTodo(req: Request, res: Response) {
    const { recordset } = await db.exec("getTodo", { id: req.params.id });

    if (!recordset[0]) {
      return res.status(422).json({ message: "No record found!" });
    }
    res.status(200).json(recordset);
  }

  @Patch("/:id")
  @Use(verifyToken)
  async updateTodo(req: Request, res: Response) {
    const id = req.params.id;
    const { recordset } = await db.exec("getTodo", { id });

    if (!recordset[0]) {
      return res.status(422).json({ message: "No record found" });
    }

    const { title, description } = req.body;
    await db.exec("UpdateTodo", { id, title, description });
    res.json({ message: "Todo updated successfully" });
  }

  @Delete("/:id")
  @Use(verifyToken)
  async deleteTodo(req: Request, res: Response) {
    const id = req.params.id;
    const { recordset } = await db.exec("getTodo", { id });

    if (!recordset[0]) {
      return res.status(422).json({ message: "No record found" });
    }

    await db.exec("DeleteTodo", { id });
    res.status(200).json({ message: "Todo deleted successfully" });
  }
}
