export const categorySwaggerDocs = {
  "/categories": {
    get: {
      tags: ["Category"],
      summary: "Get all active categories",
      responses: {
        200: {
          description: "List of categories retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Category" },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Category"],
      summary: "Create a new category",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Fiction" },
                description: {
                  type: "string",
                  example: "Imaginary stories and novels",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Category created successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },
  "/categories/{id}": {
    get: {
      tags: ["Category"],
      summary: "Get a category by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Category found" },
        404: { description: "Category not found" },
      },
    },
    put: {
      tags: ["Category"],
      summary: "Update a category",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                isActive: { type: "boolean" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Category updated" },
        401: { description: "Unauthorized" },
      },
    },
    delete: {
      tags: ["Category"],
      summary: "Delete a category",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Category deleted" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
