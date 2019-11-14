import React, { useState } from "react";
import styled from "styled-components";

const DocumentTitleInput = styled.input`
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: #ffffff;
  font-size: 3.125rem;
  height: 6rem;
  border: none;
  outline: none;
  :hover {
    // border: 0.063rem solid red;
  }

  :focus {
    border: 0.125rem solid rgb(43, 125, 233);
    border-radius: 0.25rem;
  }
`;

const DocumentTitle = () => {
  const defaultTitle = "제목 없는 문서";
  const [state, setState] = useState("");

  const onInputHandler = e => {
    const documentTitle = e.currentTarget.value;
    setState(documentTitle);
  };

  return (
    <DocumentTitleInput
      placeholder={defaultTitle}
      defaultValue={state}
      onInput={onInputHandler}
    />
  );
};

export default DocumentTitle;