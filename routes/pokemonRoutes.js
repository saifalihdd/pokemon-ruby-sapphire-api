import { Router } from "express";
import * as controller from "../controllers/pokemonController.js";

const router = Router();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/stats", controller.getStats); // harus di atas "/:id"
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.patch("/:id/exp", controller.train);
router.patch("/:id/evolve", controller.evolve);
router.patch("/:id/trainer", controller.assignTrainer);
router.patch("/:id/storage", controller.moveStorage);
router.delete("/:id", controller.remove);

export default router;
