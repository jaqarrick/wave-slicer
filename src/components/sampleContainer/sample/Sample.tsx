import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { colors } from "../../../utils/style";

interface Props {
  sampleSrc: string;
  name: string;
  sampleId: string;
  removeSample: (sampleid: string) => void;
  updateSampleName: (name: string, id: string) => void;
}

const SampleFileContainer = styled.div`
  position: relative;
  display: flex;
  width: 26%;
  height: 63px;
  border: 3px solid ${colors.dark};

  margin: 3%;
  box-sizing: content-box;
  overflow: hidden;
  cursor: pointer;
`;

const SampleNameInput = styled.input`
  height: 100%;
  border: 0;
  padding: 0;
  font-size: 25px;
  background-color: ${colors.light};
  cursor: text;
  color: ${colors.dark};
`;

const SampleNameInputContainer = styled.div`
  margin: 0;
  height: 63px;
  display: inline-block;
  padding: 0;
  margin: 0 65px;
`;

const SamplePlayButton = styled.button`
  position: absolute;
  left: 0;
  flex-grow: 1;
  margin: 0;
  border: none;
  padding: 0;
  height: 63px;
  width: 65px;
  background-color: ${colors.light};
  cursor: pointer;

  path {
    fill: ${colors.dark};
    stroke: ${colors.dark};
  }
`;

const SampleRemoveButton = styled.button`
  position: absolute;
  right: 0;
  padding: 0;
  margin: 0;
  border: none;
  width: 65px;
  height: 63px;
  border-left: 3px solid ${colors.dark};
  background-color: ${colors.light};
  cursor: pointer;
`;

const Sample: React.FC<Props> = ({
  removeSample,
  name,
  sampleSrc,
  sampleId,
  updateSampleName,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  return (
    <SampleFileContainer>
      <audio
        onEnded={() => setIsPlaying(false)}
        ref={audioRef}
        controls={false}
        src={sampleSrc}
      />
      <SamplePlayButton
        onClick={() => {
          if (audioRef.current?.paused) {
            audioRef.current?.play();
          } else {
            audioRef.current?.pause();
          }
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? (
          <svg
            width="24"
            height="36"
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15.7333 35V1H23.6667V35H15.7333Z" fill="black" />
            <path d="M9.21667 35V1H1V35H9.21667Z" fill="black" />
            <path
              d="M15.7333 35V1H23.6667V35H15.7333Z"
              stroke="black"
              strokeWidth="0.566667"
            />
            <path
              d="M9.21667 35V1H1V35H9.21667Z"
              stroke="black"
              strokeWidth="0.566667"
            />
          </svg>
        ) : (
          <svg
            width="29"
            height="35"
            viewBox="0 0 29 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.05566 34.2778L28.1516 17.6643L1.05566 1.32324V34.2778Z"
              fill="#474468"
              stroke="#474468"
              strokeWidth="0.740773"
            />
          </svg>
        )}
      </SamplePlayButton>

      <SampleNameInputContainer>
        <SampleNameInput
          type="text"
          value={name}
          onChange={(event: { target: HTMLInputElement }) =>
            updateSampleName(event.target.value, sampleId)
          }
        ></SampleNameInput>
      </SampleNameInputContainer>

      <SampleRemoveButton onClick={() => removeSample(sampleId)}>
        {" "}
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35 1L1 35M1 1L35 35"
            stroke="#474468"
            strokeWidth="2.75676"
          />
        </svg>
      </SampleRemoveButton>
    </SampleFileContainer>
  );
};

export default Sample;
