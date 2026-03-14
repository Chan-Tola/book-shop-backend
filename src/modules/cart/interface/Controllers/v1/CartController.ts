import { Request, Response } from "express";
import {
  GetMyCart,
  AddToCart,
  UpdateCartItem,
  RemoveFromCart,
  ClearCart,
} from "../../../application/v1/CartServices";

export class CartController {
  private getMyCartUC = new GetMyCart();
  private addUC = new AddToCart();
  private updateUC = new UpdateCartItem();
  private removeUC = new RemoveFromCart();
  private clearUC = new ClearCart();

  async getMyCart(req: Request, res: Response) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?.id ||
        (req as any).user?._id;
      const cart = await this.getMyCartUC.execute(userId);
      if (!cart) return res.status(200).json({ success: true, data: null });
      return res.status(200).json({
        success: true,
        data: {
          _id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalPrice: Number(cart.totalPrice.toFixed(2)),
        },
      });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?.id ||
        (req as any).user?._id;

      const { bookId, quantity } = req.body;
      const cart = await this.addUC.execute(userId, bookId, quantity);
      return res.status(200).json({
        success: true,
        data: {
          _id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalPrice: Number(cart.totalPrice.toFixed(2)),
        },
      });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?.id ||
        (req as any).user?._id;
      const { bookId, quantity } = req.body;
      const cart = await this.updateUC.execute(userId, bookId, quantity);
      return res.status(200).json({
        success: true,
        data: {
          _id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalPrice: Number(cart.totalPrice.toFixed(2)),
        },
      });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  async removeItem(req: Request, res: Response) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?.id ||
        (req as any).user?._id;
      const { bookId } = req.params;
      if (!bookId || Array.isArray(bookId)) {
        return res
          .status(400)
          .json({ success: false, message: "bookId is required" });
      }
      const cart = await this.removeUC.execute(userId, bookId);
      return res.status(200).json({
        success: true,
        data: {
          _id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalPrice: Number(cart.totalPrice.toFixed(2)),
        },
      });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const userId =
        (req as any).user?.userId ||
        (req as any).user?.id ||
        (req as any).user?._id;
      const cart = await this.clearUC.execute(userId);
      if (!cart) return res.status(200).json({ success: true, data: null });
      return res.status(200).json({
        success: true,
        data: {
          _id: cart._id,
          userId: cart.userId,
          items: cart.items,
          totalPrice: Number(cart.totalPrice.toFixed(2)),
        },
      });
    } catch (e: any) {
      return res.status(400).json({ success: false, message: e.message });
    }
  }
}
