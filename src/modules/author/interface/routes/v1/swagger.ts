export const authorSwaggerDocs = {
  "/authors": {
    get: {
      tags: ["Author"],
      summary: "Get all authors",
      description: "Returns a list of all authors in the system.",
      responses: {
        200: {
          description: "List of authors retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Author" },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Author"],
      summary: "Create a new author",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Robert C. Martin" },
                biography: {
                  type: "string",
                  example: "Software engineer and author of 'Clean Code'.",
                },
                photo: {
                  type: "string",
                  example:
                    "https://upload.wikimedia.org/wikipedia/commons/e/ee/Robert_Cecil_Martin.png",
                },
                website: {
                  type: "string",
                  example: "https://blog.cleancoder.com/",
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Author created successfully" },
        400: { description: "Invalid input" },
        401: { description: "Unauthorized - JWT required" },
      },
    },
  },
  "/authors/{id}": {
    get: {
      tags: ["Author"],
      summary: "Get an author by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Author found" },
        404: { description: "Author not found" },
      },
    },
    put: {
      tags: ["Author"],
      summary: "Update an author",
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
                biography: { type: "string" },
                photo: { type: "string" },
                website: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Author updated" },
        404: { description: "Author not found" },
      },
    },
    delete: {
      tags: ["Author"],
      summary: "Delete an author",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Author deleted" },
        404: { description: "Author not found" },
      },
    },
  },
};
