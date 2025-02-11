import express from "express";

import {
  createCashOrder,
  findAllOrders,
  filterOrdersForLoggedUser,
  findSpecificOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/orderController.js";

import { protect, allowedTo } from "../controllers/authController.js";

const router = express.Router();

router.use(protect);

router.route("/:cartId").post(allowedTo("user"), createCashOrder);
router.get(
  "/",
  allowedTo("user", "admin", "manager"),
  filterOrdersForLoggedUser,
  findAllOrders
);
router.get("/:id", allowedTo("user", "admin", "manager"), findSpecificOrder);
router.put("/:id/pay", allowedTo("admin", "manager"), updateOrderToPaid);
router.put(
  "/:id/deliver",
  allowedTo("admin", "manager"),
  updateOrderToDelivered
);

export default router;
