import { Router } from "express";
import { verifyJwtForDoctor } from "../Middlewares/Auth.middleware.js";
import { CreateNewTreatment } from "../Controllers/Treatment.Controller.js";
const router = Router();
router.route('/createTreatment').post(verifyJwtForDoctor, CreateNewTreatment)
export default router