import { Router } from "express";
import { DoctorLogin, LogoutDoctor, LogoutPatient, PatientLogin, RefreshAcessAndRefreshTokenForDoctor, RefreshAcessAndRefreshTokenForPatient, RegisterDoctor, RegisterPatient, getPhoneNumber, getPhoneNumberDoc } from "../Controllers/User.Controller.js";
import { verifyJwtForDoctor, verifyJwtForPatient } from "../Middlewares/Auth.middleware.js";
const router = Router();
router.route('/registerPatient').post(RegisterPatient)
router.route('/registerDoctor').post(RegisterDoctor)
router.route('/loginPatient').post(PatientLogin)
router.route('/loginDoctor').post(DoctorLogin)
router.route('/logoutPatient').get(verifyJwtForPatient, LogoutPatient)
router.route('/logoutDoctor').get(verifyJwtForDoctor, LogoutDoctor)
router.route('/RefreshTokenPatient').get(RefreshAcessAndRefreshTokenForPatient)
router.route('/RefreshTokenDoctor').get(RefreshAcessAndRefreshTokenForDoctor)
router.route('/getPhoneNumber').post(getPhoneNumber)
router.route('/getPhoneNumberDoc').post(getPhoneNumberDoc)
export default router