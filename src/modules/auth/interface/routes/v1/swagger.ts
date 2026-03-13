export const authSwaggerDocs = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      description: "Create a new user account with email and password",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: { type: "string", minLength: 2, example: "John Doe" },
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                password: {
                  type: "string",
                  minLength: 6,
                  example: "password123",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": { description: "User registered successfully" },
        "400": { description: "Validation error or duplicate email" },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Authenticate user and get JWT",
      description:
        "Verifies credentials and returns a Bearer token for Flutter app storage",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                password: { type: "string", example: "password123" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  token: { type: "string", description: "JWT Access Token" },
                  user: { type: "object" },
                },
              },
            },
          },
        },
        "401": { description: "Invalid email or password" },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout user",
      description: "Signals the client to clear the local token",
      responses: {
        "200": {
          description: "Logged out successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/me": {
    get: {
      tags: ["Auth"],
      summary: "Get current user profile",
      description:
        "Returns the profile of the currently authenticated user using the JWT token.",
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Profile retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean" },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        "401": { description: "Not authorized" },
      },
    },
  },
};
