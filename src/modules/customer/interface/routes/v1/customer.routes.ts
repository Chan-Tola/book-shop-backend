import { Router } from "express";
import { CustomerController } from "../../controllers/v1/CustomerController";
import { protect } from "../../../../../shared/interface/middleware/v1/AuthMiddleware";
import { requireAdmin } from "../../../../../shared/interface/middleware/v1/rbac";

const router = Router();
const controller = new CustomerController();

// All customer routes require admin authentication
router.use(protect);
router.use(requireAdmin);

// GET /api/v1/customers - Get all customers with pagination
router.get("/", controller.getAll);

// GET /api/v1/customers/stats - Get customer statistics
router.get("/stats", controller.getStats);

// GET /api/v1/customers/:id - Get customer by ID
router.get("/:id", controller.getById);

// POST /api/v1/customers - Create new customer
router.post("/", controller.create);

// PUT /api/v1/customers/:id - Update customer
router.put("/:id", controller.update);

// DELETE /api/v1/customers/:id - Delete customer (soft delete)
router.delete("/:id", controller.delete);

export default router;
