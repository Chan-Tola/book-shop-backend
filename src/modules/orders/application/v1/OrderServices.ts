import {
  OrderModel,
  IOrder,
  IShippingAddress,
  OrderStatus,
} from "../../domain/v1/Order";
import { CartModel } from "../../../cart/domain/v1/Cart";
import { BookModel } from "../../../book/domain/v1/Book";

export interface CreateOrderData {
  userId: string;
  shippingAddress: IShippingAddress;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export class CreateOrder {
  async execute(data: CreateOrderData): Promise<IOrder> {
    const { userId, shippingAddress } = data;

    // 1. Get user's cart with populated book data
    const cart = await CartModel.findOne({ userId }).populate(
      "items.bookId",
      "title author images",
    );

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // 2. Validate stock for each item
    for (const cartItem of cart.items) {
      const book = await BookModel.findById(cartItem.bookId);
      if (!book) {
        throw new Error(`Book not found: ${cartItem.bookId}`);
      }

      if (book.stock < cartItem.quantity) {
        throw new Error(
          `Insufficient stock for "${book.title}". Available: ${book.stock}, Requested: ${cartItem.quantity}`,
        );
      }
    }

    // 3. Prepare order items from cart + book data
    const orderItems = cart.items.map((item) => ({
      bookId: item.bookId,
      title: (item.bookId as any).title || "Unknown Book",
      price: item.priceAtAddition,
      quantity: item.quantity,
    }));

    // 4. Create order
    const order = new OrderModel({
      userId,
      items: orderItems,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod: "stripe",
    });

    await order.save();

    // 5. Update stock
    for (const cartItem of cart.items) {
      await BookModel.findByIdAndUpdate(cartItem.bookId, {
        $inc: { stock: -cartItem.quantity },
      });
    }

    // 6. Clear cart
    await CartModel.findOneAndUpdate(
      { userId },
      { items: [], subTotal: 0, tax: 0, totalPrice: 0 },
    );

    return order;
  }
}

export class GetMyOrders {
  async execute(
    userId: string,
    options: PaginationOptions = {},
  ): Promise<{
    orders: IOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [orders, total] = await Promise.all([
      OrderModel.find({ userId })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("items.bookId", "title author images"),
      OrderModel.countDocuments({ userId }),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class GetOrderById {
  async execute(orderId: string, userId?: string): Promise<IOrder> {
    const query: any = { _id: orderId };

    // If userId is provided, ensure user can only access their own orders
    if (userId) {
      query.userId = userId;
    }

    const order = await OrderModel.findOne(query).populate(
      "items.bookId",
      "title author images",
    );

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }
}

export class GetAllOrders {
  async execute(options: PaginationOptions = {}): Promise<{
    orders: IOrder[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const [orders, total] = await Promise.all([
      OrderModel.find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email")
        .populate("items.bookId", "title author"),
      OrderModel.countDocuments({}),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class UpdateOrderStatus {
  async execute(orderId: string, status: OrderStatus): Promise<IOrder> {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Validate status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["processing", "cancelled"],
      processing: ["cancelled"],
      cancelled: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new Error(
        `Invalid status transition from ${order.status} to ${status}`,
      );
    }

    order.status = status;
    await order.save();

    return order;
  }
}

export class CancelOrder {
  async execute(orderId: string, userId?: string): Promise<IOrder> {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Check if order can be cancelled
    if (order.status === "cancelled") {
      throw new Error("Order is already cancelled");
    }

    // If userId is provided, ensure user can only cancel their own orders
    if (userId && order.userId.toString() !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    // Update order status
    order.status = "cancelled";
    await order.save();

    // Restore stock for cancelled order
    for (const item of order.items) {
      await BookModel.findByIdAndUpdate(item.bookId, {
        $inc: { stock: item.quantity },
      });
    }

    return order;
  }
}
