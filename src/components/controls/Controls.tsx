import React from "react";
// import "./Controls.css"
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { colors } from "../../utils/style";

interface Props {
  playSelectedAudio: () => void;
  stopSelectedAudio: () => void;
  startRecording: () => void;
  isWavesurferPlaying: Boolean;
}
type ControlButtonProps = {
  side: string;
};
const ControlsContainer = styled.div`
  margin: 3em;
  display: flex;
  justify-content: center;
`;
const ControlButton = styled.button`
  cursor: pointer;
  height: 62px;
  width: 90px;
  background-color: ${colors.light};
  border-color: ${colors.dark};
  border-width: 3px;

  circle {
    fill: ${colors.dark};
  }
  path {
    fill: ${colors.dark};
    stroke: ${colors.dark};
  }
  :hover {
    background-color: ${colors.dark};
    path {
      fill: ${colors.light};
      stroke: ${colors.dark};
    }
    circle {
      fill: ${colors.light};
    }
  }
`;
// const leftButton = css`
//   border-right-width: 1.5px;
// `;
// const rightButton = css`
//   border-left-width: 1.5px;
// `;

const Controls: React.FC<Props> = ({
  startRecording,
  stopSelectedAudio,
  playSelectedAudio,
  isWavesurferPlaying,
}) => {
  return (
    <ControlsContainer>
      <ControlButton
        onClick={isWavesurferPlaying ? stopSelectedAudio : playSelectedAudio}
        style={{ borderRightWidth: "1.5px" }}
        // css={leftButton}
      >
        {isWavesurferPlaying ? (
          <svg
            width="42"
            height="42"
            viewBox="0 0 42 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M27 61V1H41V61H27Z" fill="black" />
            <path d="M15.5 61V1H1V61H15.5Z" fill="black" />
            <path d="M27 61V1H41V61H27Z" stroke="black" />
            <path d="M15.5 61V1H1V61H15.5Z" stroke="black" />
          </svg>
        ) : (
          <svg
            width="39"
            height="42"
            viewBox="0 0 39 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 46L38 23.314L1 1V46Z"
              fill="blue"
              strokeWidth="1.01154"
            />
          </svg>
        )}
      </ControlButton>
      {/* <ControlButton onClick={stopSelectedAudio}>Stop Selected Audio</ControlButton> */}
      <ControlButton
        onClick={startRecording}
        style={{ borderLeftWidth: "1.5px" }}
        // css={rightButton}
      >
        {" "}
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="21" cy="21" r="21" />
        </svg>
      </ControlButton>
      {/* <ControlButton> Stop Recording</ControlButton> */}
    </ControlsContainer>
  );
};

export default Controls;
