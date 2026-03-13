import { Request, Response } from "express";
import {
  GetAllCategories,
  GetCategoryById,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
} from "../../../application/v1/CategoryService";

export class CategoryController {
  private getAllUC = new GetAllCategories();
  private getOneUC = new GetCategoryById();
  private createUC = new CreateCategory();
  private updateUC = new UpdateCategory();
  private deleteUC = new DeleteCategory();

  // GET ALL
  getAll = async (_req: Request, res: Response) => {
    try {
      const categories = await this.getAllUC.execute();
      res.status(200).json({ success: true, data: categories });
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
          .json({ success: false, error: "Invalid category id" });
      }
      const category = await this.getOneUC.execute(id);
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      res.status(404).json({ success: false, error: (error as Error).message });
    }
  };

  // CREATE
  create = async (req: Request, res: Response) => {
    try {
      const category = await this.createUC.execute(req.body);
      res.status(201).json({ success: true, data: category });
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
          .json({ success: false, error: "Invalid category id" });
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
          .json({ success: false, error: "Invalid category id" });
      }
      await this.deleteUC.execute(id);
      res
        .status(200)
        .json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, error: (error as Error).message });
    }
  };
}
