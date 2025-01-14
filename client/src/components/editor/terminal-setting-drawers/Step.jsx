import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faUbuntu, faJs } from "@fortawesome/free-brands-svg-icons";

const STEP_TYPE = {
  OS: faUbuntu,
  ProgrammingLanguge: faJs,
  Databse: faDatabase,
};

const StepWrapper = styled.div`
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  text-align: center;
  line-height: 2rem;
  border-radius: 100%;
  background-color: red;
`;

const Step = ({ icon }) => {
  return (
    <StepWrapper>
      <FontAwesomeIcon icon={icon} />
    </StepWrapper>
  );
};

export { Step, STEP_TYPE };
