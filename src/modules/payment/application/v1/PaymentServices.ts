import Stripe from "stripe";
import { PaymentModel, IPayment, PaymentStatus } from "../../domain/v1/Payment";
import {
  OrderModel,
  IOrder,
  OrderStatus,
} from "../../../orders/domain/v1/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface CreatePaymentIntentData {
  orderId: string;
  userId: string;
}

export interface ConfirmPaymentData {
  paymentIntentId: string;
  userId: string;
}

export class CreatePaymentIntent {
  async execute(data: CreatePaymentIntentData): Promise<{
    paymentIntent: Stripe.PaymentIntent;
    clientSecret: string;
    payment: IPayment;
  }> {
    const { orderId, userId } = data;

    // 1. Get order details
    const order = await OrderModel.findOne({ _id: orderId, userId });
    if (!order) {
      throw new Error("Order not found");
    }

    // 2. Check if payment already exists
    const existingPayment = await PaymentModel.findOne({ orderId });
    if (existingPayment) {
      // Return existing payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(
        existingPayment.paymentIntentId,
      );
      return {
        paymentIntent,
        clientSecret: existingPayment.clientSecret,
        payment: existingPayment,
      };
    }

    // 3. Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // 4. Save payment record
    const payment = new PaymentModel({
      paymentIntentId: paymentIntent.id,
      orderId: order._id,
      userId: userId,
      amount: order.totalPrice,
      currency: "usd",
      status: "pending",
      stripeStatus: paymentIntent.status as any,
      clientSecret: paymentIntent.client_secret!,
      metadata: {
        orderNumber: order.orderNumber,
        userId: userId,
      },
    });

    await payment.save();

    return {
      paymentIntent,
      clientSecret: paymentIntent.client_secret!,
      payment,
    };
  }
}

export class ConfirmPayment {
  async execute(data: ConfirmPaymentData): Promise<{
    payment: IPayment;
    order: IOrder;
  }> {
    const { paymentIntentId, userId } = data;

    // 1. Get payment record
    const payment = await PaymentModel.findOne({ paymentIntentId, userId });
    if (!payment) {
      throw new Error("Payment not found");
    }

    // 2. Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // 3. Update payment status
    payment.stripeStatus = paymentIntent.status as any;

    if (paymentIntent.status === "succeeded") {
      payment.status = "succeeded";

      // 4. Update order status
      const order = await OrderModel.findByIdAndUpdate(
        payment.orderId,
        {
          status: "completed",
          paymentStatus: "paid",
        },
        { new: true },
      ).populate("items.bookId", "title author images");

      if (!order) {
        throw new Error("Order not found");
      }

      return { payment, order };
    } else if (paymentIntent.status === "canceled") {
      payment.status = "canceled";

      // Update order status
      const order = await OrderModel.findByIdAndUpdate(
        payment.orderId,
        {
          status: "cancelled",
          paymentStatus: "failed",
        },
        { new: true },
      ).populate("items.bookId", "title author images");

      if (!order) {
        throw new Error("Order not found");
      }

      return { payment, order };
    }

    await payment.save();

    const order = await OrderModel.findById(payment.orderId).populate(
      "items.bookId",
      "title author images",
    );
    if (!order) {
      throw new Error("Order not found");
    }

    return { payment, order };
  }
}

export class HandleWebhook {
  async execute(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "payment_intent.succeeded":
        await this.handlePaymentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      case "payment_intent.payment_failed":
        await this.handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      case "payment_intent.canceled":
        await this.handlePaymentCanceled(
          event.data.object as Stripe.PaymentIntent,
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const { orderId } = paymentIntent.metadata;

    // Update payment record
    await PaymentModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        status: "succeeded",
        stripeStatus: "succeeded",
      },
    );

    // Update order
    await OrderModel.findByIdAndUpdate(orderId, {
      status: "completed",
      paymentStatus: "paid",
    });

    console.log(`Payment succeeded for order ${orderId}`);
  }

  private async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const { orderId } = paymentIntent.metadata;

    // Update payment record
    await PaymentModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        status: "failed",
        stripeStatus: "failed",
      },
    );

    // Update order
    await OrderModel.findByIdAndUpdate(orderId, {
      paymentStatus: "failed",
    });

    console.log(`Payment failed for order ${orderId}`);
  }

  private async handlePaymentCanceled(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    const { orderId } = paymentIntent.metadata;

    // Update payment record
    await PaymentModel.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      {
        status: "canceled",
        stripeStatus: "canceled",
      },
    );

    // Update order
    await OrderModel.findByIdAndUpdate(orderId, {
      status: "cancelled",
      paymentStatus: "failed",
    });

    console.log(`Payment canceled for order ${orderId}`);
  }
}

export class GetPaymentByOrderId {
  async execute(orderId: string, userId?: string): Promise<IPayment> {
    const query: any = { orderId };

    if (userId) {
      query.userId = userId;
    }

    const payment = await PaymentModel.findOne(query).populate(
      "orderId",
      "orderNumber totalPrice",
    );

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  }
}

export class StripeHealthCheck {
  async execute(): Promise<{ accountId: string; email?: string }> {
    const account = await stripe.accounts.retrieve();
    return {
      accountId: account.id,
      email: (account as any).email,
    };
  }
}
