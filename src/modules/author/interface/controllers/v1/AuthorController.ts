import { Request, Response } from "express";
import {
  GetAllAuthors,
  GetAuthorById,
  CreateAuthor,
  UpdateAuthor,
  DeleteAuthor,
} from "../../../application/v1/AuthorService";

export class AuthorController {
  private getAllUC = new GetAllAuthors();
  private getOneUC = new GetAuthorById();
  private createUC = new CreateAuthor();
  private updateUC = new UpdateAuthor();
  private deleteUC = new DeleteAuthor();

  // GET ALL
  getAll = async (_req: Request, res: Response) => {
    try {
      const authors = await this.getAllUC.execute();
      res.status(200).json({ success: true, data: authors });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  // GET ONE BY ID
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid author id" });
      }
      const author = await this.getOneUC.execute(id);
      res.status(200).json({ success: true, data: author });
    } catch (error) {
      res.status(404).json({ success: false, error: (error as Error).message });
    }
  };

  // CREATE
  create = async (req: Request, res: Response) => {
    try {
      const author = await this.createUC.execute(req.body);
      res.status(201).json({ success: true, data: author });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  // UPDATE
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid author id" });
      }
      const result = await this.updateUC.execute(id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  // DELETE
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid author id" });
      }
      await this.deleteUC.execute(id);
      res
        .status(200)
        .json({ success: true, message: "Author deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };
}
