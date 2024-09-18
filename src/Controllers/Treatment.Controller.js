import { Treatment } from "../Models/Treatment.model.js";
import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/ApiHandler.js";
import { ApiResponse } from "../utils/Apiresponse.js";
const CreateNewTreatment = asyncHandler(async (req, res) => {
    const currDoc = req.user
    const { PatientName, AadharNumber, DiagonsedWith, Remarks } = req.body;
    if (!PatientName || !AadharNumber || !DiagonsedWith || !Remarks) {
        throw new ApiError(402, "Please enter all the details")
    }
    const newTreatment = await Treatment.create({
        PatientName: PatientName,
        AadharNumber,
        DiagonsedWith,
        Remarks,
        DoctorId: currDoc._id
    })
    res.status(200).json(
        new ApiResponse("treatment Sucessfully created", 200, newTreatment)
    )
})
export { CreateNewTreatment }