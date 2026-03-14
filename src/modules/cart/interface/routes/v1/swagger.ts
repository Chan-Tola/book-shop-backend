export const cartSwaggerDocs = {
  "/carts": {
    get: {
      tags: ["Cart"],
      summary: "Get my cart",
      description: "Returns the current user's cart with items.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Cart fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Cart" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/carts/add": {
    post: {
      tags: ["Cart"],
      summary: "Add book to cart",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["bookId"],
              properties: {
                bookId: { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
                quantity: { type: "number", example: 1 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Book added to cart",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Cart" },
                },
              },
            },
          },
        },
        400: { description: "Invalid request" },
        401: { description: "Unauthorized" },
        404: { description: "Book not found" },
      },
    },
  },

  "/carts/update": {
    put: {
      tags: ["Cart"],
      summary: "Update cart item quantity",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["bookId", "quantity"],
              properties: {
                bookId: { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
                quantity: { type: "number", example: 2, minimum: 1 },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Cart item updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Cart" },
                },
              },
            },
          },
        },
        400: { description: "Invalid request" },
        401: { description: "Unauthorized" },
        404: { description: "Item not found" },
      },
    },
  },

  "/carts/remove/{bookId}": {
    delete: {
      tags: ["Cart"],
      summary: "Remove book from cart",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "bookId",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: {
          description: "Item removed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Cart" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
        404: { description: "Item not found" },
      },
    },
  },

  "/carts/clear": {
    delete: {
      tags: ["Cart"],
      summary: "Clear cart",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Cart cleared",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Cart" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },
};

// --- SCHEMA DEFINITION FOR COMPONENTS ---
export const cartSchema = {
  CartItem: {
    type: "object",
    properties: {
      bookId: {
        oneOf: [
          { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
          { $ref: "#/components/schemas/Book" },
        ],
      },
      quantity: { type: "number", example: 1 },
      priceAtAddition: { type: "number", example: 15.5 },
    },
  },
  Cart: {
    type: "object",
    properties: {
      _id: { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
      userId: {
        oneOf: [
          { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
          { $ref: "#/components/schemas/User" },
        ],
      },
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/CartItem" },
      },
      subTotal: { type: "number", example: 31.0 },
      tax: { type: "number", example: 3.1 },
      totalPrice: { type: "number", example: 34.1 },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
};
