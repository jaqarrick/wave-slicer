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
import InfoModal from "./components/infoModal/infoModal";
import MobileDeviceModal from "./components/mobileDeviceModal/mobileDeviceModal";

interface WrapperProps {
  showModal: boolean;
}
const Wrapper = styled.div<WrapperProps>`
  opacity: ${({ showModal }) => (showModal ? 0.2 : 1)};
  cursor: ${({ showModal }) => (showModal ? "pointer" : "default")};
  height: inherit;
  width: inherit;
`;

const InnerWrapper = styled.div`
  max-width: 1100px;
  height: inherit;
  margin: auto;
`;
const TitleHeader = styled.header`
  font-family: "plasticregular";
  font-size: 5rem;
  padding-top: 0.7rem;
  color: ${colors.dark};
  display: flex;
  justify-content: space-between;

  .info-button {
    font-family: "milestone_outlineregular";
    cursor: pointer;
  }
`;

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
  const [showModal, setShowModal] = useState<boolean>(false);

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
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
          navigator.userAgent
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          navigator.userAgent.substr(0, 4)
        )
      ) {
        return;
      }
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
      const newSampleData = allSampleData.map((item) => {
        if (id === item.id) {
          item.name = name.slice(0, 10).toLowerCase();
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
    if (wavesurfer.current.getDuration() > 0) {
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

  const toggleModal = useCallback(() => setShowModal(!showModal), [
    setShowModal,
    showModal,
  ]);

  return (
    <>
      <GlobalStyles />
      <MobileDeviceModal />
      {showModal ? <InfoModal toggleModal={toggleModal} /> : null}
      <Wrapper
        showModal={showModal}
        onClick={showModal ? toggleModal : undefined}
      >
        <InnerWrapper>
          <TitleHeader>
            {" "}
            <div> WAVE SLICER </div>{" "}
            <div onClick={toggleModal} className="info-button">
              ?
            </div>{" "}
          </TitleHeader>
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
        </InnerWrapper>
      </Wrapper>
    </>
  );
};
export default App;
