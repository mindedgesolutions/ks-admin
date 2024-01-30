import React, { useState } from "react";
import {
  BankRelated,
  SubmitBtn,
  UserInputSelect,
  UserInputText,
  UserPageHeader,
  UserPageWrapper,
} from "../../../../components";
import ApplicationMenu from "../../../../components/user/portal/application/ApplicationMenu";
import customFetch from "../../../../utils/customFetch";
import { splitErrors } from "../../../../utils/showErrors";
import { useLoaderData, useNavigate } from "react-router-dom";
import Select from "react-select";
import { relationships } from "../../../../utils/data";
import { useUserContext } from "../UserLayout";

export const loader = async () => {
  try {
    const banks = await customFetch.get("/master/banks");
    const schemes = await customFetch.get("/master/schemes");
    const info = await customFetch.get("/applications/user/bank-nominee");
    return { banks, schemes, info };
  } catch (error) {
    splitErrors(error?.response?.data?.msg);
    return error;
  }
};

const BankInfo = () => {
  document.title = `Bank & Nominee Information | ${
    import.meta.env.VITE_USER_TITLE
  }`;
  const relationshipsList = relationships.filter(
    (relation) => relation.isActive === true
  );
  const { appId } = useUserContext();
  const [isIdle, setIsIdle] = useState(false);
  const navigate = useNavigate();

  const { banks, schemes, info } = useLoaderData();
  const options = [];
  banks.data.data.rows.map((bank) => {
    const bankElement = { value: bank.ifsc_code, label: bank.ifsc_code };
    options.push(bankElement);
  });
  const optionSchemes = [];
  schemes.data.data.rows.map((scheme) => {
    const schemeElement = { value: scheme.id, label: scheme.schemes_name };
    optionSchemes.push(schemeElement);
  });

  const [selectedSchemes, setSelectedSchemes] = useState([]);

  const handleSchemeChange = async (selected) => {
    setSelectedSchemes(selected);
  };

  const [form, setForm] = useState({
    khadyasathiNo: info.data?.data?.rows[0]?.khadyasathi_no || "",
    sasthyasathiNo: info.data?.data?.rows[0]?.sasthyasathi_no || "",
    nomineeName: info.data?.data?.rows[0]?.nominee_name || "",
    nomineeRelation: info.data?.data?.rows[0]?.nominee_relationship || "",
    nomineeMobile: info.data?.data?.rows[0]?.nominee_mobile || "",
    nomineeAadhaar: info.data?.data?.rows[0]?.nominee_aadhar || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    setIsIdle(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputValues = Object.fromEntries(formData);
    const process =
      info.data.data.rowCount > 0 ? customFetch.patch : customFetch.post;
    const msg = info.data.data.rowCount > 0 ? `Data updated` : `Data added`;
    try {
      await process("/applications/user/bank-nominee", inputValues);
      toast.success(msg);
      setIsIdle(false);
      navigate("/user/agency-info");
    } catch (error) {
      splitErrors(error?.response?.data?.msg);
      setIsIdle(false);
      return error;
    }
  };

  return (
    <>
      <UserPageHeader title="Bank & Nominee Information" />
      <UserPageWrapper>
        <div className="card">
          <div className="row g-0">
            <ApplicationMenu />

            <div className="col d-flex flex-column">
              <form onSubmit={handleFormSubmit} autoComplete="off">
                <input type="text" name="appId" defaultValue={appId} />

                <div className="card-body">
                  <div className="row row-cards">
                    <BankRelated options={options} />

                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Ration Card / Khadya Sathi Card no."
                        name="khadyasathiNo"
                        required={true}
                        value={form.khadyasathiNo}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Sasthya Sathi Card no."
                        name="sasthyasathiNo"
                        required={false}
                        value={form.sasthyasathiNo}
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

                  <div className="row row-cards mt-1">
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Nominee name"
                        name="nomineeName"
                        required={true}
                        value={form.nomineeName}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputSelect
                        label="Relationship with the nominee"
                        name="nomineeRelation"
                        required={true}
                        options={relationshipsList}
                        value={form.nomineeRelation}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Nominee mobile no."
                        name="nomineeMobile"
                        required={true}
                        value={form.nomineeMobile}
                        handleChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <UserInputText
                        label="Nominee Aadhaar no."
                        name="nomineeAadhaar"
                        required={true}
                        value={form.nomineeAadhaar}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <SubmitBtn isIdle={isIdle} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </UserPageWrapper>
    </>
  );
};

export default BankInfo;
