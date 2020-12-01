import React from "react";
import styled from "@emotion/styled";
import { colors } from "../../utils/style";

const ModalWrapper = styled.div`
  display: none;
  position: absolute;
  background-color: ${colors.light};
  z-index: 10;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  h1 {
    width: 60px;
    font-family: "plasticregular";
    font-size: 3.5em;
    writing-mode: vertical-rl;
    text-orientation: upright;
    margin: 0;

    @media (max-height: 630px) {
      font-size: 2.9em;
    }
  }
  div {
    margin-left: 70px;
    position: absolute;
    padding-right: 1em;
    text-align: justify;

    div {
      width: 100%;
      font-size: 2em;
      text-align: center;
      margin-left: 0;
      margin-top: 1em;
    }
  }

  @media (max-width: 450px) {
    display: flex;
  }
`;

const MobileDeviceModal: React.FC = () => {
  return (
    <ModalWrapper>
      <h1>WAVE SLICER</h1>
      <div>
        This app isn't optimized for mobile devices. To use it open on a device
        with a larger screen.
        <br></br>
        <div>&#9785;</div>
      </div>
    </ModalWrapper>
  );
};

export default MobileDeviceModal;
