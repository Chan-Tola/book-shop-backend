export const orderSwaggerDocs = {
  "/orders/checkout": {
    post: {
      tags: ["Order"],
      summary: "Create order from cart",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["shippingAddress"],
              properties: {
                shippingAddress: {
                  $ref: "#/components/schemas/ShippingAddress",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Order created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Order" },
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

  "/orders/my-orders": {
    get: {
      tags: ["Order"],
      summary: "Get my orders",
      description: "Get customer orders with pagination",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "number" }, example: 1 },
        { name: "limit", in: "query", schema: { type: "number" }, example: 10 },
        {
          name: "sortBy",
          in: "query",
          schema: { type: "string" },
          example: "createdAt",
        },
        {
          name: "sortOrder",
          in: "query",
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "desc",
        },
      ],
      responses: {
        200: {
          description: "Orders retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/OrderList" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/orders/my-orders/{id}": {
    get: {
      tags: ["Order"],
      summary: "Get order details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Order retrieved successfully" },
        404: { description: "Order not found" },
      },
    },
    delete: {
      tags: ["Order"],
      summary: "Cancel order",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Order cancelled successfully" },
        400: { description: "Failed to cancel order" },
      },
    },
  },

  "/orders": {
    get: {
      tags: ["Order"],
      summary: "Get all orders (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "number" }, example: 1 },
        { name: "limit", in: "query", schema: { type: "number" }, example: 20 },
        {
          name: "sortBy",
          in: "query",
          schema: { type: "string" },
          example: "createdAt",
        },
        {
          name: "sortOrder",
          in: "query",
          schema: { type: "string", enum: ["asc", "desc"] },
          example: "desc",
        },
      ],
      responses: {
        200: {
          description: "All orders retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/OrderList" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/orders/{id}": {
    get: {
      tags: ["Order"],
      summary: "Get any order details (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Order retrieved successfully" },
        404: { description: "Order not found" },
      },
    },
    delete: {
      tags: ["Order"],
      summary: "Cancel any order (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Order cancelled successfully" },
        400: { description: "Failed to cancel order" },
      },
    },
  },

  "/orders/{id}/status": {
    put: {
      tags: ["Order"],
      summary: "Update order status (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["status"],
              properties: {
                status: {
                  type: "string",
                  enum: ["pending", "processing", "cancelled"],
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Order status updated successfully" },
        400: { description: "Invalid status" },
      },
    },
  },
};

// --- SCHEMA DEFINITION FOR COMPONENTS ---
export const orderSchema = {
  OrderItem: {
    type: "object",
    properties: {
      bookId: {
        oneOf: [
          { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
          { $ref: "#/components/schemas/Book" },
        ],
      },
      title: { type: "string", example: "Clean Architecture" },
      quantity: { type: "number", example: 2 },
      price: { type: "number", example: 45.99 },
    },
  },
  ShippingAddress: {
    type: "object",
    properties: {
      street: { type: "string", example: "123 Main St" },
      city: { type: "string", example: "New York" },
      state: { type: "string", example: "NY" },
      zipCode: { type: "string", example: "10001" },
      country: { type: "string", example: "United States" },
    },
  },
  Order: {
    type: "object",
    properties: {
      _id: { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
      orderNumber: { type: "string", example: "ORD-20260315-123456789" },
      userId: {
        oneOf: [
          { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
          { $ref: "#/components/schemas/User" },
        ],
      },
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/OrderItem" },
      },
      totalPrice: { type: "number", example: 91.98 },
      status: { type: "string", example: "pending" },
      shippingAddress: { $ref: "#/components/schemas/ShippingAddress" },
      paymentMethod: { type: "string", example: "stripe" },
      paymentStatus: { type: "string", example: "pending" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  OrderList: {
    type: "object",
    properties: {
      orders: {
        type: "array",
        items: { $ref: "#/components/schemas/Order" },
      },
      total: { type: "number", example: 25 },
      page: { type: "number", example: 1 },
      totalPages: { type: "number", example: 3 },
    },
  },
};
