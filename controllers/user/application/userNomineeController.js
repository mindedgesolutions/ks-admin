import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { getApplicationId } from "../../../utils/functions.js";

// Bank & Nominee information functions start ------
export const addBankInfo = async (req, res) => {
  const { mobile, applicationId } = req.appUser;
  const {
    appId,
    ifscCode,
    bankName,
    branchName,
    accountNo,
    khadyasathiNo,
    sasthyasathiNo,
    schemes,
    nomineeName,
    nomineeRelation,
    nomineeMobile,
    nomineeAadhaar,
  } = req.body;
  console.log(
    `${appId}, ${ifscCode}, ${bankName}, ${branchName}, ${accountNo}, ${khadyasathiNo}, ${sasthyasathiNo}, ${schemes}, ${nomineeName}, ${nomineeRelation}, ${nomineeMobile}, ${nomineeAadhaar}`
  );
  return;

  res.status(StatusCodes.CREATED).json({ msg: `success` });
};

export const updateBankInfo = async (req, res) => {
  const { mobile, applicationId } = req.appUser;
};

export const getBankInfo = async (req, res) => {
  const { mobile, applicationId } = req.appUser;
  const searchBy = applicationId || (await getApplicationId(mobile));
  const data = await pool.query(
    `select kwn.*, kwm.khadyasathi_no, kwm.sasthyasathi_no from k_migrant_worker_nominees kwn join k_migrant_worker_master kwm on kwn.application_id=kwm.id where kwn.application_id=$1`,
    [searchBy]
  );
  res.status(StatusCodes.OK).json({ data });
};
// Bank & Nominee information functions end ------
