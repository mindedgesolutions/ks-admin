import { Router } from "express";
const router = Router();
import {
  getAllApplications,
  workerMasterInfo,
} from "../controllers/admin/applicationController.js";
import {
  protectRoute,
  protectUserRoute,
} from "../middleware/protectRouteMiddleware.js";
import {
  accessAgency,
  accessBank,
  accessWorksite,
} from "../middleware/checkAccessMiddleware.js";
import {
  validateAgency,
  validateBank,
  validatePersonal,
  validateWorksite,
} from "../middleware/userApplicationMiddleware.js";
import {
  addPersonalInfo,
  getCurrentApplication,
  getPersonalInfo,
  updatePersonalInfo,
} from "../controllers/user/application/userPersonalController.js";
import {
  addWorksiteInfo,
  getAgencyInfo,
  getWorksiteInfo,
  updateAgencyInfo,
  updateWorksiteInfo,
} from "../controllers/user/application/userWorksiteController.js";
import {
  addBankInfo,
  getBankInfo,
  getUserSchemes,
  updateBankInfo,
} from "../controllers/user/application/userNomineeController.js";
import { uploadDocument } from "../controllers/user/application/userDocumentController.js";
import {
  addFamilyMember,
  deleteMember,
  getAllMembers,
  getSingleMember,
  updateSingleMember,
} from "../controllers/user/application/userFamilyController.js";
import { availableAccess } from "../controllers/user/application/accessController.js";

// Admin routes ------
router.get("/all", protectRoute, getAllApplications);
router.get("/single/:id", protectRoute, workerMasterInfo);

// User routes start ------
router.get(
  "/user/current-application",
  protectUserRoute,
  getCurrentApplication
);
router.get("/user/application-access", protectUserRoute, availableAccess); // Application part access
router
  .route("/user/personal-info")
  .get(protectUserRoute, getPersonalInfo)
  .post([protectUserRoute, validatePersonal], addPersonalInfo)
  .patch([protectUserRoute, validatePersonal], updatePersonalInfo); // Personal information
router
  .route("/user/worksite-info")
  .get([protectUserRoute, accessWorksite], getWorksiteInfo)
  .post([protectUserRoute, validateWorksite], addWorksiteInfo)
  .patch([protectUserRoute, validateWorksite], updateWorksiteInfo); // Worksite information
router
  .route("/user/agency-info")
  .get([protectUserRoute, accessAgency], getAgencyInfo)
  .patch([protectUserRoute, validateAgency], updateAgencyInfo); // Agency information
router
  .route("/user/bank-nominee")
  .get([protectUserRoute, accessBank], getBankInfo)
  .post([protectUserRoute, validateBank], addBankInfo)
  .patch([protectUserRoute, validateBank], updateBankInfo); // Bank / Nominee information

// User schemes related starts ------
router.get("/user/selected-schemes", protectUserRoute, getUserSchemes);
// User schemes related end ------

// User family related routes start ------
router.post("/user/family-info", protectUserRoute, addFamilyMember);
router.get("/user/all-members", protectUserRoute, getAllMembers);
router.get("/user/single-member/:id", protectUserRoute, getSingleMember);
router.patch("/user/update-member/:id", protectUserRoute, updateSingleMember);
router.delete("/user/delete/:id", deleteMember);
// User family related routes end ------

router.route("/user/documents").post(protectUserRoute, uploadDocument); // Documents

// User routes end ------

export default router;
