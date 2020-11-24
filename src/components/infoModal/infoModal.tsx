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
  border: solid;
`;

const InfoModal: React.FC<Props> = ({ toggleModal }) => {
  return (
    <ModalContainer>
      <button onClick={toggleModal}>close</button>
      <p>
        Aenean non lorem nec mauris elementum finibus vel congue lorem. Aliquam
        pharetra vehicula lectus, sit amet laoreet leo convallis eget. Nunc
        mollis id ante ut mattis. Fusce dictum nunc sed gravida pharetra. Mauris
        imperdiet consequat nunc a commodo. Suspendisse turpis neque
      </p>
      <p>
        scelerisque et purus id, laoreet laoreet enim. Etiam eleifend non metus
        ac congue. Nulla eu elit aliquam, tristique magna mattis, faucibus urna.
        Nulla tincidunt nibh a orci lobortis pulvinar.{" "}
      </p>
      <p>
        Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
        inceptos himenaeos. Donec volutpat justo quis velit vestibulum lacinia.
        Praesent eget condimentum libero. Duis porttitor, arcu et fermentum
        viverra, nisl tellus dignissim nibh, at scelerisque metus lacus ut sem.
        Fusce rhoncus sem non massa fringilla convallis.
      </p>
    </ModalContainer>
  );
};

export default InfoModal;
