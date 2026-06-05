import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controller/task.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getTasks).post(createTask);
router.route("/:taskId").get(getTaskById).patch(updateTask).delete(deleteTask);
router.route("/:taskId/status").patch(updateTaskStatus);

export default router;
