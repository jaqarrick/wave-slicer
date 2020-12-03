import React from "react";
import styled from "@emotion/styled";
import { colors } from "../../utils/style";

interface Props {
  toggleModal: () => void;
}

const ModalContainer = styled.div`
  position: absolute;
  background-color: ${colors.light};
  z-index: 5;
  width: 45%;
  left: 0;
  right: 0;
  top: 20%;
  margin-left: auto;
  margin-right: auto;
  padding: 3em;
  color: ${colors.dark};
  border: solid ${colors.dark} 3px;

  p {
    font-size: 1.3em;
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.5em;
  margin-top: 1px;
  margin-right: 5px;
  cursor: pointer;
`;

const InfoModal: React.FC<Props> = ({ toggleModal }) => {
  return (
    <ModalContainer>
      <CloseIcon onClick={toggleModal}>X</CloseIcon>
      <p>
        To use Wave Slicer simply place an audio file into the drop zone. Drag
        over the region of the waveform you want to sample and click the record
        button. Your samples will appear underneath. Rename them whatever you
        want! <br />
        <br />
        You can listen back to your samples or remove them. A download button
        will appear at the bottom right of the screen. <br /> <br />
        Check out the source code <a href="https://github.com/jaqarrick/wave-slicer">here</a>!
      </p>
    </ModalContainer>
  );
};

export default InfoModal;
