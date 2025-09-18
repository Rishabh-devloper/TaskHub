import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validate-schema.js";
import { z } from "zod";
import mongoose from "mongoose";
import {
  createProject,
  getProjectDetails,
  getProjectTasks,
} from "../controllers/project.js";

const router = express.Router();

// Middleware to validate ObjectId parameters
const validateObjectId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: `Invalid ${paramName}. Please provide a valid ID.`,
    });
  }
  next();
};

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateObjectId('workspaceId'),
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
    body: projectSchema,
  }),
  createProject
);

router.get(
  "/:projectId",
  authMiddleware,
  validateObjectId('projectId'),
  validateRequest({
    params: z.object({ projectId: z.string() }),
  }),
  getProjectDetails
);

router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateObjectId('projectId'),
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  getProjectTasks
);
export default router;
