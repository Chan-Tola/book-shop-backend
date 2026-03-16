import { Types } from "mongoose";
import { CartModel } from "../../domain/v1/Cart";
import { BookModel } from "../../../book/domain/v1/Book";

export class GetMyCart {
  async execute(userId: string) {
    return await CartModel.findOne({ userId }).populate("items.bookId");
  }
}

export class AddToCart {
  async execute(userId: string, bookId: string, quantity: number = 1) {
    // 1) validate stock
    const book = await BookModel.findById(bookId);
    if (!book) throw new Error("Book not found");
    if (book.stock < quantity) throw new Error("Out of stock");

    // 2) find or create cart
    let cart = await CartModel.findOne({ userId });
    if (!cart) cart = await CartModel.create({ userId, items: [] });

    // 3) upsert item
    const idx = cart.items.findIndex((i) => i.bookId.toString() === bookId);
    if (idx >= 0) {
      const existing = cart.items[idx];
      if (!existing) throw new Error("Cart item not found");
      existing.quantity += quantity;
    } else {
      cart.items.push({
        bookId: new Types.ObjectId(bookId),
        quantity,
        priceAtAddition: book.price,
      });
    }

    // 4) recalc totals
    recalcTotals(cart);

    return await cart.save();
  }
}

export class UpdateCartItem {
  async execute(userId: string, bookId: string, quantity: number) {
    // Validate stock
    const book = await BookModel.findById(bookId);
    if (!book) throw new Error("Book not found");
    if (book.stock < quantity) throw new Error("Out of stock");

    const cart = await CartModel.findOne({ userId });
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find((i) => i.bookId.toString() === bookId);
    if (!item) throw new Error("Item not found");

    item.quantity = quantity;

    recalcTotals(cart);

    return await cart.save();
  }
}

export class RemoveFromCart {
  async execute(userId: string, bookId: string) {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter((i) => i.bookId.toString() !== bookId);

    recalcTotals(cart);

    return await cart.save();
  }
}

export class ClearCart {
  async execute(userId: string) {
    const cart = await CartModel.findOne({ userId });
    if (!cart) return null;

    cart.items = [];
    recalcTotals(cart);

    return await cart.save();
  }
}

// helper
function recalcTotals(cart: any) {
  cart.subTotal = cart.items.reduce(
    (sum: number, i: any) => sum + i.priceAtAddition * i.quantity,
    0,
  );
  cart.tax = 0;
  cart.totalPrice = Number(cart.subTotal.toFixed(2));
}
