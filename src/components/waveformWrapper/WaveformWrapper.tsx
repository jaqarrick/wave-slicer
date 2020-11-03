import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { colors } from "../../utils/style";

const WaveFormContainer = styled.div`
  background-color: ${colors.dark};
  margin-top: 50px;
`;
interface Props {
  initWavesurfer: (waveformRef: React.RefObject<HTMLDivElement>) => void;
  handleWaveformClick: () => void;
  handleZoom: (e: React.ChangeEvent<HTMLInputElement>) => void;
  zoomValue: number;
  handleDrop: (e: any) => void;
}

const InputContainer = styled.div`
  margin-top: 10px;
  width: 387px;
`;

const WaveformWrapper: React.FC<Props> = ({
  initWavesurfer,
  handleWaveformClick,
  handleZoom,
  zoomValue,
  handleDrop,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (waveformRef.current !== null) {
      initWavesurfer(waveformRef);
    }
  }, [initWavesurfer]);

  return (
    <>
      <WaveFormContainer onMouseDown={handleWaveformClick} ref={waveformRef} />
      <InputContainer>
        <input
          type="range"
          min="20"
          max="1000"
          value={zoomValue}
          step="10"
          onInput={handleZoom}
        />
      </InputContainer>

      <div
        ref={dropZoneRef}
        onDrop={(e) => handleDrop(e)}
        onDragOver={(e) => e.preventDefault()}
        className="dropzone"
      ></div>
    </>
  );
};

export default WaveformWrapper;
