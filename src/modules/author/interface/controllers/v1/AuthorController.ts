import { Request, Response } from "express";
import {
  GetAllAuthors,
  GetAuthorById,
  CreateAuthor,
  UpdateAuthor,
  DeleteAuthor,
} from "../../../application/v1/AuthorService";
import {
  uploadFileToR2,
  deleteFileFromR2ByUrl,
} from "../../../../../shared/infrastructure/services/R2StorageService";

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
      const file = req.file as Express.Multer.File | undefined;
      const payload = { ...req.body } as Record<string, unknown>;

      if (file) {
        const safeName = file.originalname.replace(/\s+/g, "-");
        const fileName = `authors/${Date.now()}-${safeName}`;
        payload.photo = await uploadFileToR2(
          file.buffer,
          fileName,
          file.mimetype,
        );
      }

      const author = await this.createUC.execute(payload);
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
      const file = req.file as Express.Multer.File | undefined;
      const payload = { ...req.body } as Record<string, unknown>;

      for (const key of Object.keys(payload)) {
        if (payload[key] === "") delete payload[key];
      }

      if (file) {
        const existingAuthor = await this.getOneUC.execute(id);
        const safeName = file.originalname.replace(/\s+/g, "-");
        const fileName = `authors/${Date.now()}-${safeName}`;
        payload.photo = await uploadFileToR2(
          file.buffer,
          fileName,
          file.mimetype,
        );

        if (
          existingAuthor.photo &&
          typeof existingAuthor.photo === "string" &&
          existingAuthor.photo.includes("r2.dev")
        ) {
          await deleteFileFromR2ByUrl(existingAuthor.photo);
        }
      }

      const result = await this.updateUC.execute(id, payload);
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
      const author = await this.deleteUC.execute(id);
      if (
        author.photo &&
        typeof author.photo === "string" &&
        author.photo.includes("r2.dev")
      ) {
        await deleteFileFromR2ByUrl(author.photo);
      }
      res
        .status(200)
        .json({ success: true, message: "Author deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };
}
