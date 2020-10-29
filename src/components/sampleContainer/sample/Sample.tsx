import React, { useRef, useState } from "react";

interface Props {
  sampleSrc: string;
  name: string;
  sampleId: string;
  removeSample: (sampleid: string) => void;
  updateSampleName: (name: string, id: string) => void;
}

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
    <div>
      <audio
        onEnded={() => setIsPlaying(false)}
        ref={audioRef}
        controls={false}
        src={sampleSrc}
      />
      <button
        onClick={() => {
          if (audioRef.current?.paused) {
            audioRef.current?.play();
          } else {
            audioRef.current?.pause();
          }
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? "pause" : "play"}
      </button>

      <a href={sampleSrc} download={`${name}.wav`}>
        download
      </a>
      <button onClick={() => removeSample(sampleId)}> remove </button>
      <input
        type="text"
        value={name}
        onChange={(event: { target: HTMLInputElement }) =>
          updateSampleName(event.target.value, sampleId)
        }
      ></input>
    </div>
  );
};

export default Sample;
