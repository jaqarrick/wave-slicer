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
        Aenean non lorem nec mauris elementum finibus vel congue lorem. Aliquam
        pharetra vehicula lectus, sit amet laoreet leo convallis eget. Nunc
        mollis id ante ut mattis. Fusce dictum nunc sed gravida pharetra. Mauris
        imperdiet consequat nunc a commodo. Suspendisse turpis neque.
      </p>
    </ModalContainer>
  );
};

export default InfoModal;
