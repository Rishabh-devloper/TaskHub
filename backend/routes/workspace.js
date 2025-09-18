import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  acceptGenerateInvite,
  acceptInviteByToken,
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
  getPendingInvitations,
  acceptInvitationById,
  declineInvitation,
} from "../controllers/workspace.js";
import {
  inviteMemberSchema,
  tokenSchema,
  workspaceSchema,
} from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { z } from "zod";
import mongoose from "mongoose";

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
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateObjectId('workspaceId'),
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateObjectId('workspaceId'),
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
);

router.get("/", authMiddleware, getWorkspaces);
router.get("/pending-invitations", authMiddleware, getPendingInvitations);

router.get("/:workspaceId", validateObjectId('workspaceId'), authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", validateObjectId('workspaceId'), authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", validateObjectId('workspaceId'), authMiddleware, getWorkspaceStats);

router.post("/invitations/:invitationId/accept", validateObjectId('invitationId'), authMiddleware, acceptInvitationById);
router.delete("/invitations/:invitationId/decline", validateObjectId('invitationId'), authMiddleware, declineInvitation);

export default router;
