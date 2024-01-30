import { StatusCodes } from "http-status-codes";
import pool from "../../../db.js";
import { BadRequestError } from "../../../errors/customErrors.js";

// Family information functions start ------
export const addFamilyMember = async (req, res) => {
  const {
    memberAadhaar,
    memberAge,
    memberEpic,
    memberGender,
    memberName,
    memberRelation,
    schemes,
  } = req.body;
  const { mobile } = req.appUser;
  const applicationId = await pool.query(
    `select id, identification_number from k_migrant_worker_master where mobile=$1`,
    [mobile]
  );
  const appId = Number(applicationId.rows[0].id);
  const mwin = applicationId.rows[0].identification_number;
  if (appId) {
    const data = await pool.query(
      `insert into k_migrant_family_info(mwin_no, application_id, member_name, member_gender, member_age, member_aadhar_no, member_relationship) values($1, $2, $3, $4, $5, $6, $7)`,
      [
        mwin,
        appId,
        memberName,
        memberGender,
        memberAge,
        memberAadhaar,
        memberRelation,
      ]
    );
    res.status(StatusCodes.CREATED).json({ data: `success` });
  } else {
    throw new BadRequestError(`Something went wrong! Please try again`);
  }
};

export const getAllMembers = async (req, res) => {
  const { mobile } = req.appUser;
  const applicationId = await pool.query(
    `select id, identification_number from k_migrant_worker_master where mobile=$1`,
    [mobile]
  );
  const appId = Number(applicationId.rows[0].id);
  if (appId) {
    const data = await pool.query(
      `select * from k_migrant_family_info where application_id=$1`,
      [appId]
    );
    res.status(StatusCodes.OK).json({ data });
  } else {
    throw new BadRequestError(
      `Something went wrong! Please try refreshing the page`
    );
  }
};

export const getSingleMember = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `select * from k_migrant_family_info where id=$1`,
    [id]
  );
  res.status(StatusCodes.OK).json({ data });
};

export const updateSingleMember = async (req, res) => {
  const { id } = req.params;
  const { memberName, memberGender, memberAge, memberAadhaar, memberRelation } =
    req.body;
  const data = await pool.query(
    `update k_migrant_family_info set member_name=$1, member_gender=$2, member_age=$3, member_aadhar_no=$4, member_relationship=$5 where id=$6`,
    [memberName, memberGender, memberAge, memberAadhaar, memberRelation, id]
  );
  res.status(StatusCodes.ACCEPTED).json({ data: `success` });
};

export const deleteMember = async (req, res) => {
  const { id } = req.params;
  const data = await pool.query(
    `delete from k_migrant_family_info where id=$1`,
    [id]
  );
  res.status(StatusCodes.NO_CONTENT).json({ data: `success` });
};
// Family information functions end ------
