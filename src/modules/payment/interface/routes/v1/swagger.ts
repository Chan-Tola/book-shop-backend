export const paymentSwaggerDocs = {
  "/payments/intent": {
    post: {
      tags: ["Payment"],
      summary: "Create payment intent",
      description: "Creates a Stripe PaymentIntent for an order.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["orderId"],
              properties: {
                orderId: {
                  type: "string",
                  example: "65f4c3d2e1f0a9b8c7d6e5f4",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Payment intent created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      paymentIntentId: { type: "string", example: "pi_123" },
                      clientSecret: {
                        type: "string",
                        example: "pi_123_secret_456",
                      },
                      amount: { type: "number", example: 1099 },
                      currency: { type: "string", example: "usd" },
                      status: {
                        type: "string",
                        example: "requires_payment_method",
                      },
                      payment: { $ref: "#/components/schemas/Payment" },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: "Invalid request" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/payments/confirm": {
    post: {
      tags: ["Payment"],
      summary: "Confirm payment",
      description:
        "Fetches the PaymentIntent status from Stripe and updates order/payment.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["paymentIntentId"],
              properties: {
                paymentIntentId: { type: "string", example: "pi_123" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Payment status updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "object",
                    properties: {
                      payment: { $ref: "#/components/schemas/Payment" },
                      order: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
          },
        },
        400: { description: "Invalid request" },
      },
    },
  },

  "/payments/order/{orderId}": {
    get: {
      tags: ["Payment"],
      summary: "Get payment by order id",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "orderId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Payment retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Payment" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: { description: "Payment not found" },
      },
    },
  },

  "/payments/stripe-health": {
    get: {
      tags: ["Payment"],
      summary: "Stripe connection health check",
      description: "Verifies Stripe API connectivity using the secret key.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Stripe connection ok",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Stripe connection ok" },
                  data: {
                    type: "object",
                    properties: {
                      accountId: { type: "string", example: "acct_1234567890" },
                      email: { type: "string", example: "admin@example.com" },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        500: { description: "Stripe connection failed" },
      },
    },
  },
};

// --- SCHEMA DEFINITION FOR COMPONENTS ---
export const paymentSchema = {
  Payment: {
    type: "object",
    properties: {
      _id: { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
      paymentIntentId: { type: "string", example: "pi_123" },
      orderId: {
        oneOf: [
          { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
          { $ref: "#/components/schemas/Order" },
        ],
      },
      userId: {
        oneOf: [
          { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
          { $ref: "#/components/schemas/User" },
        ],
      },
      amount: { type: "number", example: 10.99 },
      currency: { type: "string", example: "usd" },
      status: { type: "string", example: "pending" },
      stripeStatus: { type: "string", example: "requires_payment_method" },
      clientSecret: { type: "string", example: "pi_123_secret_456" },
      metadata: {
        type: "object",
        properties: {
          orderNumber: { type: "string", example: "ORD-20260315-123456789" },
          userId: { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
        },
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
};
