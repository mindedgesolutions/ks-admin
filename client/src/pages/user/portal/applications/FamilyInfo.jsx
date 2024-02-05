import React, { useEffect, useState } from "react";
import {
  ConfirmDeleteFamily,
  FamilyTable,
  SubmitBtn,
  UserInputRadio,
  UserInputSelect,
  UserInputText,
  UserPageHeader,
  UserPageWrapper,
} from "../../../../components";
import ApplicationMenu from "../../../../components/user/portal/application/ApplicationMenu";
import { genders, relationships } from "../../../../utils/data";
import Select from "react-select";
import { splitErrors } from "../../../../utils/showErrors";
import customFetch from "../../../../utils/customFetch";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../UserLayout";

export const loader = async () => {
  try {
    const schemes = await customFetch.get("/master/schemes");
    const members = await customFetch.get("/applications/user/all-members");
    return { schemes, members };
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};

const FamilyInfo = () => {
  const { schemes, members } = useLoaderData();

  const [form, setForm] = useState({
    memberName: "",
    memberGender: "",
    memberAge: "",
    memberRelation: "",
    memberAadhaar: "",
    memberEpic: "",
    btnLabel: "Add member",
  });
  const [allMembers, setAllMembers] = useState(members.data.data.rows || []);
  const [editId, setEditId] = useState("");
  const [isIdle, setIsIdle] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Schemes related starts ------
  const optionSchemes = [];
  schemes.data.data.rows.map((scheme) => {
    const schemeElement = { value: scheme.id, label: scheme.schemes_name };
    optionSchemes.push(schemeElement);
  });

  const [selectedSchemes, setSelectedSchemes] = useState([]);

  const handleSchemeChange = (selected) => {
    setSelectedSchemes(JSON.stringify(selected));
  };
  // Schemes related ends ------

  const [modal, setModal] = useState({
    showModal: false,
    memberId: "",
    memberName: "",
  });

  const relationshipsList = relationships.filter(
    (relation) => relation.isActive === true
  );

  const getMembers = async () => {
    const members = await customFetch.get("/applications/user/all-members");
    const newMembers = members.data.data.rows;
    setAllMembers(newMembers);
  };

  // Adding family member / Form submit starts ------
  const handleFormSubmit = async (e) => {
    setIsIdle(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let inputValues = Object.fromEntries(formData);
    inputValues = { ...inputValues, schemes: selectedSchemes };
    try {
      await customFetch.post("/applications/user/family-info", inputValues);
      toast.success(`Family member added`);
      getMembers();
      setForm({
        ...form,
        ...{
          memberName: "",
          memberGender: "",
          memberAge: "",
          memberRelation: "",
          memberAadhaar: "",
          memberEpic: "",
          schemes: [],
          btnLabel: "Add member",
        },
      });
      setIsIdle(false);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };
  // Adding family member / Form submit ends ------

  // Edit family member / Form edit starts ------
  const handleEditInfo = async (id) => {
    setEditId(id);
    try {
      const { data } = await customFetch.get(
        `/applications/user/single-member/${id}`
      );
      const {
        member_aadhar_no,
        member_age,
        member_gender,
        member_name,
        member_relationship,
      } = data.data.rows[0];
      setForm({
        ...form,
        ...{
          memberName: member_name,
          memberGender: member_gender,
          memberAge: member_age,
          memberRelation: member_relationship,
          memberAadhaar: member_aadhar_no,
          memberEpic: "123456",
          schemes: [],
          btnLabel: "Save changes",
        },
      });
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };

  const handlEditSave = async (e) => {
    setIsIdle(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      await customFetch.patch(
        `/applications/user/update-member/${editId}`,
        data
      );
      toast.success(`Information updated`);
      getMembers();
      setForm({
        ...form,
        ...{
          memberName: "",
          memberGender: "",
          memberAge: "",
          memberRelation: "",
          memberAadhaar: "",
          memberEpic: "",
          schemes: [],
          btnLabel: "Add member",
        },
      });
      setEditId("");
      setIsIdle(false);
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      return error;
    }
  };
  // Edit family member / Form edit ends ------

  // Modal related and Delete member functions start ------
  const confirmDelete = (id, name) => {
    setModal({
      ...modal,
      ...{ showModal: true, memberId: id, memberName: name },
    });
  };

  const handleClose = () => {
    setModal({ ...modal, showModal: false });
  };

  const deleteConfirmed = async () => {
    await customFetch.delete(`/applications/user/delete/${modal.memberId}`);
    toast.success(`Member deleted successfully`);
    getMembers();
    setModal({
      ...modal,
      ...{ showModal: false, memberId: "", memberName: "" },
    });
  };
  // Modal related and Delete member functions end ------

  const resetForm = () => {
    setForm({
      ...form,
      ...{
        memberName: "",
        memberGender: "",
        memberAge: "",
        memberRelation: "",
        memberAadhaar: "",
        memberEpic: "",
        schemes: [],
        btnLabel: "Add member",
      },
    });
  };

  return (
    <>
      <UserPageHeader title="Family Related Information" />
      <UserPageWrapper>
        <div className="card">
          <div className="row g-0">
            <ApplicationMenu />

            <div className="col d-flex flex-column">
              <form
                onSubmit={!editId ? handleFormSubmit : handlEditSave}
                autoComplete="off"
              >
                <div className="card-body">
                  <div className="row row-cards">
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Family member name"
                        name="memberName"
                        required={true}
                        value={form.memberName}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputRadio
                        label="Gender"
                        name="memberGender"
                        required={true}
                        options={genders}
                        value={form.memberGender}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Age"
                        name="memberAge"
                        required={true}
                        value={form.memberAge}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputSelect
                        label="Relationship"
                        name="memberRelation"
                        options={relationshipsList}
                        required={true}
                        value={form.memberRelation}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Aadhaar no."
                        name="memberAadhaar"
                        required={true}
                        value={form.memberAadhaar}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="EPIC no."
                        name="memberEpic"
                        required={Number(form.memberAge) >= 18}
                        value={form.memberEpic}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <label htmlFor="schemes" className="form-label required">
                        Availed schemes
                      </label>
                      <Select
                        name="schemes"
                        options={optionSchemes}
                        onChange={handleSchemeChange}
                        isMulti
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <SubmitBtn text={form.btnLabel} isIdle={isIdle} />
                    <button
                      type="button"
                      className="btn btn-default ms-2"
                      onClick={resetForm}
                    >
                      Reset form
                    </button>
                  </div>
                </div>
              </form>
              <div className="card-body px-2">
                <FamilyTable
                  members={allMembers}
                  confirmDelete={confirmDelete}
                  handleEditInfo={handleEditInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </UserPageWrapper>

      <ConfirmDeleteFamily
        modal={modal}
        deleteConfirmed={deleteConfirmed}
        handleClose={handleClose}
      />
    </>
  );
};

export default FamilyInfo;
