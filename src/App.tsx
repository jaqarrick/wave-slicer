import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
import * as WaveSurfer from "../node_modules/wavesurfer.js/dist/wavesurfer";
import RegionsPlugin from "../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions";
//@ts-ignore
// import sample from "./garoto.mp3"
import Controls from "./components/controls/Controls";
import { SampleTimesObject, SampleData } from "./types";
import SampleContainer from "./components/sampleContainer/SampleContainer";
import WaveformWrapper from "./components/waveformWrapper/WaveformWrapper";
import { GlobalStyles } from "./utils/style";
import { colors } from "./utils/style";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import styled from "@emotion/styled";
import { debounce } from "lodash";

const DownloadButton = styled.button`
  position: fixed;
  right: 0;
  bottom: 0;
  background: ${colors.light};
  border: none;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
`;
const App: React.FC = () => {
  // const waveFormRef = useRef<HTMLDivElement | null>(null)
  const wavesurfer = useRef<any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<null | MediaRecorder>(
    null
  );
  const [isMouseOverRegion, setIsMouseOverRegion] = useState<Boolean>(false);
  const [zoomValue, setZoomValue] = useState<number>(20);
  const [isWavesurferPlaying, setIsWaveSurferPlaying] = useState<Boolean>(
    false
  );
  const [wavesurferReady, setWavesurferReady] = useState<boolean>(false);

  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.on("play", () => {
        setIsWaveSurferPlaying(true);
      });
      wavesurfer.current.on("region-out", () => {
        setIsWaveSurferPlaying(false);
      });
      wavesurfer.current.on("finish", () => {
        setIsWaveSurferPlaying(false);
      });
    }
  }, [setIsWaveSurferPlaying]);

  const initWavesurfer = useCallback(
    (waveformRef: React.RefObject<HTMLDivElement>) => {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: colors.light,
        progressColor: "#C0BCE4",
        backend: "MediaElementWebAudio",
        pixelRatio: 1,
        minPxPerSec: 25,
        plugins: [
          RegionsPlugin.create({
            regionsMinLength: 0,
            maxRegions: 1,
            color: "rgb(192, 188, 228, 0.3)",
            regions: [],
            dragSelection: {
              slop: 1,
            },
          }),
        ],
      });
      // Creates a mediastream for mediaRecorder
      const streamDestination: MediaStreamAudioDestinationNode = wavesurfer.current.backend.ac.createMediaStreamDestination();
      // wavesurfer.current.load("./NOISE.wav");
      // Creates a gainNode to use as a wavesurfer filter (just needs to be something for the audio to pass through)
      const gainNode: GainNode = wavesurfer.current.backend.ac.createGain();
      // Connects gain node to the audio stream
      gainNode.connect(streamDestination);
      wavesurfer.current.backend.setFilter(gainNode);
      setMediaRecorder(new MediaRecorder(streamDestination.stream));
    },
    [setMediaRecorder]
  );

  const handleZoom = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // console.log(zoomValue);
      // console.log("change");
      setZoomValue(Number(e.target.value));
    },
    [setZoomValue, zoomValue]
  );

  useEffect(() => {
    console.log(zoomValue);
    // debounceZoom(zoomValue);
    // console.log(zoomValue)
    wavesurfer.current.zoom(zoomValue);
  }, [zoomValue]);

  // const debounceZoom = useCallback((zoomValue) => {
  //   debounce(() => {
  //     console.log("input");
  //     wavesurfer.current.zoom(zoomValue);
  //   }, 30);
  // }, []);

  const [sampleTimes, setSampleTimes] = useState<SampleTimesObject>({
    start: 0,
    end: 0,
  });

  const sampleDuration = useMemo(
    (): number => sampleTimes.end - sampleTimes.start,
    [sampleTimes]
  );
  const playSelectedAudio = useCallback(() => {
    // Look at this later and see if theres a better solution
    const { start, end } = sampleTimes;
    wavesurfer.current.play(start, end);
  }, [sampleTimes]);

  //whenever a region is updated, update the start and end times of the region
  useEffect(() => {
    wavesurfer.current.on("region-updated", (region) => {
      setSampleTimes({ start: region.start, end: region.end });
    });
  }, [setSampleTimes]);

  useEffect(() => {
    wavesurfer.current.on("region-mouseenter", () => {
      setIsMouseOverRegion(true);
    });
    wavesurfer.current.on("region-mouseleave", () => {
      setIsMouseOverRegion(false);
    });
  }, [setIsMouseOverRegion]);

  const [allSampleData, setAllSampleData] = useState<SampleData[]>([]);
  const length = useRef<number>(0);
  useEffect(() => {
    length.current = allSampleData.length;
  }, [allSampleData]);

  const createSampleObject = useCallback(
    (e) => {
      const sampleObject = {
        sampleSrc: URL.createObjectURL(e.data),
        name: `sample${length.current}`,
        id: uuidv4(),
        sampleBlob: e.data,
      };
      setAllSampleData((previousData) => [...previousData, sampleObject]);
    },
    [setAllSampleData]
  );

  useEffect(
    () => mediaRecorder?.addEventListener("dataavailable", createSampleObject),
    [mediaRecorder, createSampleObject]
  );

  const updateSampleName = useCallback(
    (name, id) => {
      // const currentSampleObject = allSampleData.find(({id}) => id === id)
      // console.log(currentSampleObject)
      const newSampleData = allSampleData.map((item) => {
        if (id === item.id) {
          item.name = name;
        }
        return item;
      });
      console.log(newSampleData);

      setAllSampleData(newSampleData);
    },
    [allSampleData]
  );

  const removeSample = useCallback(
    (sampleId: string) =>
      setAllSampleData(
        allSampleData.filter((object: SampleData) => object.id !== sampleId)
      ),
    [allSampleData, setAllSampleData]
  );

  const [hasRecordingStarted, setHasRecordingStarted] = useState<boolean>(
    false
  );
  const startRecording = useCallback(() => {
    if (!hasRecordingStarted) {
      console.log("recording started");
      playSelectedAudio();
      console.log(sampleDuration);
      setHasRecordingStarted(true);
      if (mediaRecorder) {
        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
          setHasRecordingStarted(false);
        }, sampleDuration * 1000);
      }
    }
  }, [
    sampleDuration,
    playSelectedAudio,
    mediaRecorder,
    hasRecordingStarted,
    setHasRecordingStarted,
  ]);

  const stopSelectedAudio = useCallback(() => {
    if (wavesurfer.current) {
      wavesurfer.current?.stop();
      setIsWaveSurferPlaying(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      console.log("handleDrop");
      e.preventDefault();
      const fileURL = URL.createObjectURL(e.dataTransfer.items[0].getAsFile());
      console.log(fileURL);
      wavesurfer.current.load(fileURL);
      wavesurfer.current.regions.clear();
      setWavesurferReady(true);
    },
    [setWavesurferReady]
  );

  const handleWaveformClick = useCallback(() => {
    if (isMouseOverRegion === false) {
      wavesurfer.current.regions.clear();
    }
  }, [isMouseOverRegion]);

  const downloadSamples = useCallback(() => {
    console.log("download samples");
    const zip = new JSZip();
    allSampleData.forEach((sample: SampleData) => {
      console.log(sample.sampleBlob);

      zip.file(`${sample.name}.wav`, sample.sampleBlob);
    });
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "samples.zip");
      console.log(blob);
    });
  }, [allSampleData]);

  return (
    <>
      <GlobalStyles />
      <WaveformWrapper
        initWavesurfer={initWavesurfer}
        handleWaveformClick={handleWaveformClick}
        handleZoom={handleZoom}
        zoomValue={zoomValue}
        handleDrop={handleDrop}
        wavesurferReady={wavesurferReady}
      />

      <Controls
        playSelectedAudio={playSelectedAudio}
        stopSelectedAudio={stopSelectedAudio}
        startRecording={startRecording}
        isWavesurferPlaying={isWavesurferPlaying}
      />
      {allSampleData.length > 0 ? (
        <DownloadButton onClick={downloadSamples}>
          <svg
            width="40"
            height="57"
            viewBox="0 0 40 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.2392 0V42.2562M20.2392 42.2562L35.4666 19.0343M20.2392 42.2562L5.01172 19.0343M38 51L35.4666 54.5H5.01172L2 51"
              stroke="#474468"
              strokeWidth="3.04549"
            />
          </svg>
        </DownloadButton>
      ) : (
        ""
      )}
      <SampleContainer
        allSampleData={allSampleData}
        updateSampleName={updateSampleName}
        removeSample={removeSample}
      />
    </>
  );
};
export default App;
