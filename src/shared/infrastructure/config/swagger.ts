import { authSwaggerDocs } from "../../../modules/auth/interface/routes/v1/swagger";
import { authorSwaggerDocs } from "../../../modules/author/interface/routes/v1/swagger";
import { categorySwaggerDocs } from "../../../modules/category/interface/routes/v1/swagger";

const baseSpec = {
  openapi: "3.0.0",
  info: {
    title: "E-commerce API",
    version: "1.0.0",
    description: "Flutter E-commerce Backend API",
  },
  servers: [{ url: "http://localhost:3000/api/v1" }],
  components: {
    schemas: {
      // Category schema
      Category: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64f1c2a9b2c1f5a8e9d12345" },
          name: { type: "string", example: "Fiction" },
          description: {
            type: "string",
            example: "Imaginary stories and novels",
          },
          slug: { type: "string", example: "fiction" },
          isActive: { type: "boolean", example: true },
        },
      },

      // Author schema
      Author: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65f2a1b2c3d4e5f6g7h8i9j0" },
          name: { type: "string", example: "Robert C. Martin" },
          biography: { type: "string", example: "Author of Clean Code" },
          photo: { type: "string", example: "https://link-to-photo.com" },
          website: { type: "string", example: "https://cleancoder.com" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {} as Record<string, any>,
};

// Merge all module swagger docs
const mergeSwaggerDocs = () => {
  const paths = { ...baseSpec.paths };

  // Import and merge auth module docs
  Object.assign(paths, authSwaggerDocs, categorySwaggerDocs, authorSwaggerDocs);

  return {
    ...baseSpec,
    paths,
  };
};

export const specs = mergeSwaggerDocs();
