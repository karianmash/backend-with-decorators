import { Request, Response } from "express";
import { v4 as uid } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Connection from "../helpers/db";
import { Controller, Get, Post } from "../decorators";
import { IUser } from "../interfaces/user";

const db = new Connection();

@Controller("/user")
class UserController {
  @Post("/register")
  async addUser(req: Request, res: Response) {
    const id = uid();
    const { name, email, password } = req.body as IUser;
    const hashed_password = await bcrypt.hash(password, 10);

    await db.exec("insertUser", { id, name, email, password: hashed_password });
    res.status(201).json({ message: "User created successfully!" });
  }

  @Get("/:id")
  async getUser(req: Request, res: Response) {
    const id = req.params.id;
    const { recordset } = await db.exec("getUser", { id });
    res.status(200).json(recordset);
  }

  @Post("/login")
  async loginUser(req: Request, res: Response) {
    const { password, email } = req.body as IUser;
    const { recordset } = await db.exec("getUserbyEmail", { email });

    if (!recordset[0]) {
      return res.status(422).json({ message: "User not Found" });
    }

    const valid_password = await bcrypt.compare(
      password,
      recordset[0].password
    );
    if (!valid_password) {
      return res.status(422).json({ message: "User not found!" });
    }

    const token: string = jwt.sign(recordset[0], process.env.SECRET as string, {
      expiresIn: "30m",
    });
    return res.json(token);
  }
}
