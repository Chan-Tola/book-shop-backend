import { Request, Response } from "express";
import {
  GetAllBooks,
  GetBookById,
  CreateBook,
  UpdateBook,
  DeleteBook,
} from "../../../application/v1/BookServices";
import {
  uploadFileToR2,
  deleteFileFromR2ByUrl,
} from "../../../../../shared/infrastructure/services/R2StorageService";

export class BookController {
  private getAllUC = new GetAllBooks();
  private getOneUC = new GetBookById();
  private createUC = new CreateBook();
  private updateUC = new UpdateBook();
  private deleteUC = new DeleteBook();

  getAll = async (_req: Request, res: Response) => {
    try {
      const books = await this.getAllUC.execute();
      res.status(200).json({ success: true, data: books });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid book id" });
      }
      const book = await this.getOneUC.execute(id);
      res.status(200).json({ success: true, data: book });
    } catch (error) {
      res.status(404).json({ success: false, error: (error as Error).message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const payload = { ...req.body } as Record<string, unknown>;

      if (files && files.length > 0) {
        const imageUrls = await Promise.all(
          files.map((file) => {
            const safeName = file.originalname.replace(/\s+/g, "-");
            const fileName = `books/${Date.now()}-${safeName}`;
            return uploadFileToR2(file.buffer, fileName, file.mimetype);
          }),
        );
        payload.images = imageUrls;
      }

      const book = await this.createUC.execute(payload);
      res.status(201).json({ success: true, data: book });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid book id" });
      }
      const files = req.files as Express.Multer.File[] | undefined;
      const payload = { ...req.body } as Record<string, unknown>;

      for (const key of Object.keys(payload)) {
        if (payload[key] === "") delete payload[key];
      }

      if (files && files.length > 0) {
        const existingBook = await this.getOneUC.execute(id);
        const imageUrls = await Promise.all(
          files.map((file) => {
            const safeName = file.originalname.replace(/\s+/g, "-");
            const fileName = `books/${Date.now()}-${safeName}`;
            return uploadFileToR2(file.buffer, fileName, file.mimetype);
          }),
        );
        payload.images = imageUrls;

        if (existingBook.images && existingBook.images.length > 0) {
          await Promise.all(
            existingBook.images.map((url) => deleteFileFromR2ByUrl(url)),
          );
        }
      }

      const result = await this.updateUC.execute(id, payload);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid book id" });
      }
      const book = await this.deleteUC.execute(id);
      if (book.images && book.images.length > 0) {
        await Promise.all(book.images.map((url) => deleteFileFromR2ByUrl(url)));
      }
      res
        .status(200)
        .json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };
}
