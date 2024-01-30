import { Router } from "express";
const router = Router();
import {
  getBankSingle,
  getBanks,
  getBlocks,
  getDistrictName,
  getDistricts,
  getPs,
  getSchemes,
  getStates,
  getSubDivisions,
  getWards,
} from "../controllers/masterController.js";

router.get("/districts", getDistricts);
router.get("/sub-divisions/:district", getSubDivisions);
router.get("/blocks/:subDivCode/:blType", getBlocks);
router.get("/wards/:blockCode", getWards);
router.get("/ps/:district", getPs);
router.get("/states", getStates);
router.get("/banks", getBanks);
router.get("/bank-single/:ifsc", getBankSingle);
router.get("/schemes", getSchemes);

router.get("/district-name/:id", getDistrictName);

export default router;
