import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { findUser, listUsers, patchUser, removeUser, storeUser } from "./users.controller";

const router = Router();

router.get("/", authenticate, authorize("admin"), listUsers);
router.get("/:id", authenticate, authorize("admin"), findUser);
router.post("/", authenticate, authorize("admin"), storeUser);
router.patch("/:id", authenticate, authorize("admin"), patchUser);
router.delete("/:id", authenticate, authorize("admin"), removeUser);

export default router;
