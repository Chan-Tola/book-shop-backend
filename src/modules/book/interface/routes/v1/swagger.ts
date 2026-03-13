export const bookSwaggerDocs = {
  "/books": {
    get: {
      tags: ["Book"],
      summary: "Get all books",
      description: "Returns a list of all books with populated details.",
      responses: {
        200: {
          description: "Successful operation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Book" },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Book"],
      summary: "Create a new book",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["title", "author", "category", "price", "images"],
              properties: {
                title: { type: "string", example: "Clean Architecture" },
                author: { type: "string", example: "65f2a1b2c3d4e5f6g7h8i9j0" },
                category: {
                  type: "string",
                  example: "65f3b2c3d4e5f6g7h8i9j1a2",
                },
                price: { type: "number", example: 45.99 },
                description: {
                  type: "string",
                  example:
                    "A craftsman's guide to software structure and design.",
                },
                images: {
                  type: "array",
                  items: { type: "string", format: "binary" },
                },
                stock: { type: "number", example: 100 },
                rating: { type: "number", example: 4.8 },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Book created successfully" },
        400: { description: "Invalid input" },
        401: { description: "Unauthorized - JWT required" },
      },
    },
  },
  "/books/{id}": {
    get: {
      tags: ["Book"],
      summary: "Get book by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Book found" },
        404: { description: "Book not found" },
      },
    },
    put: {
      tags: ["Book"],
      summary: "Update a book",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                author: { type: "string" },
                category: { type: "string" },
                price: { type: "number" },
                description: { type: "string" },
                images: {
                  type: "array",
                  items: { type: "string", format: "binary" },
                },
                stock: { type: "number" },
                rating: { type: "number" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Book updated successfully" },
        404: { description: "Book not found" },
      },
    },
    delete: {
      tags: ["Book"],
      summary: "Delete a book",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Book deleted successfully" },
        404: { description: "Book not found" },
      },
    },
  },
};

// --- SCHEMA DEFINITION FOR COMPONENTS ---
export const bookSchema = {
  Book: {
    type: "object",
    properties: {
      _id: { type: "string", example: "65f4c3d2e1f0a9b8c7d6e5f4" },
      title: { type: "string", example: "Clean Architecture" },
      author: {
        oneOf: [
          { type: "string", example: "65f2a1b2c3d4e5f6g7h8i9j0" },
          { $ref: "#/components/schemas/Author" },
        ],
      },
      category: { type: "string", example: "65f3b2c3d4e5f6g7h8i9j1a2" },
      price: { type: "number", example: 45.99 },
      description: { type: "string", example: "A craftsman's guide..." },
      images: {
        type: "array",
        items: { type: "string" },
        example: ["https://link1.com", "https://link2.com"],
      },
      stock: { type: "number", example: 100 },
      rating: { type: "number", example: 4.8 },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
};
