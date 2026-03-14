import { authSwaggerDocs } from "../../../modules/auth/interface/routes/v1/swagger";
import {
  authorSwaggerDocs,
  authorSchema,
} from "../../../modules/author/interface/routes/v1/swagger";
import {
  categorySwaggerDocs,
  categorySchema,
} from "../../../modules/category/interface/routes/v1/swagger";
import {
  bookSwaggerDocs,
  bookSchema,
} from "../../../modules/book/interface/routes/v1/swagger";
import {
  cartSwaggerDocs,
  cartSchema,
} from "../../../modules/cart/interface/routes/v1/swagger";

const baseSpec = {
  openapi: "3.0.0",
  info: {
    title: "E-commerce API",
    version: "1.0.0",
    description: "Flutter E-commerce Backend API",
  },
  servers: [{ url: "http://localhost:3000/api/v1" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      // Category schema
      ...categorySchema,

      // Author schema
      ...authorSchema,

      // Book schema
      ...bookSchema,

      // Cart schema
      ...cartSchema,
    },
  },
  paths: {} as Record<string, any>,
};

// Merge all module swagger docs
const mergeSwaggerDocs = () => {
  const paths = { ...baseSpec.paths };

  // Import and merge auth module docs
  Object.assign(
    paths,
    authSwaggerDocs,
    categorySwaggerDocs,
    authorSwaggerDocs,
    bookSwaggerDocs,
    cartSwaggerDocs,
  );

  return {
    ...baseSpec,
    paths,
  };
};

export const specs = mergeSwaggerDocs();
