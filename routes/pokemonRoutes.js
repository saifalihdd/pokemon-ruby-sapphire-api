import { Router } from "express";
import * as controller from "../controllers/pokemonController.js";

const router = Router();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.patch("/:id/evolve", controller.evolve);
router.delete("/:id", controller.remove);

export default router;