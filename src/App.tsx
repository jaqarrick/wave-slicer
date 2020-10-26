import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import "./App.css"
import * as WaveSurfer from "../node_modules/wavesurfer.js/dist/wavesurfer"
import RegionsPlugin from "../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions"
//@ts-ignore
// import sample from "./garoto.mp3"
import Controls from "./components/controls/Controls"
import { SampleTimesObject, SampleData } from "./types"
import SampleContainer from "./components/sampleContainer/SampleContainer"

const App: React.FC = () => {
	const waveFormRef = useRef<any>(null)
	const dropZoneRef = useRef<any>(null)
	const wavesurfer = useRef<any>(null)
	const [mediaRecorder, setMediaRecorder] = useState<null | MediaRecorder>(null)
	const [isMouseOverRegion, setIsMouseOverRegion] = useState<Boolean>(false)
	const [zoomValue, setZoomValue] = useState<number>(20)

	//Initial App Render: setup wavesurfer object and connect ac backend to Media Recorder
	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
			container: waveFormRef.current,
			waveColor: "violet",
			progressColor: "purple",
			backend: "MediaElementWebAudio",
			plugins: [
				RegionsPlugin.create({
					regionsMinLength: 0,
					maxRegions: 1,
					regions: [],
					dragSelection: {
						slop: 1,
					},
				}),
			],
		})
		// Creates a mediastream for mediaRecorder
		const streamDestination: MediaStreamAudioDestinationNode = wavesurfer.current.backend.ac.createMediaStreamDestination()
		wavesurfer.current.load("./NOISE.wav")
		// Creates a gainNode to use as a wavesurfer filter (just needs to be something for the audio to pass through)
		const gainNode: GainNode = wavesurfer.current.backend.ac.createGain()
		// Connects gain node to the audio stream
		gainNode.connect(streamDestination)
		wavesurfer.current.backend.setFilter(gainNode)
		setMediaRecorder(new MediaRecorder(streamDestination.stream))
		console.log(wavesurfer.current)
	}, [])



	// const handleZoom = useCallback((e) => {
	// 	if(e.deltaY > 10 || e.deltaY < -10) {
	// 		e.preventDefault()
	// 		setZoomValue((oldValue) => {
	// 			const newZoomValue = oldValue += e.deltaY * -0.20
	// 			return Math.min(Math.max(20, Math.ceil(newZoomValue)), 1000)
	// 		})
	// 	}	
	// }, [setZoomValue])

	const handleZoom = useCallback((e) => {
		setZoomValue(e.target.value)
	}, [setZoomValue])

	// useEffect(() => {
	// 	waveFormRef.current.addEventListener('wheel', (e) => {
	// 		if(e.deltaY > 10 || e.deltaY < -10) {
	// 			e.preventDefault()
	// 			setZoomValue((oldValue) => {
	// 				const newZoomValue = oldValue += e.deltaY * -0.20
	// 				return Math.min(Math.max(20, Math.ceil(newZoomValue)), 1000)
	// 			})	
	// 		}
	// 	})
	// }, [setZoomValue])



	useEffect(() => {

		wavesurfer.current.zoom(zoomValue)
		// console.log(zoomValue)
	}, [zoomValue])

	const [sampleTimes, setSampleTimes] = useState<SampleTimesObject>({
		start: 0,
		end: 0,
	})

	const sampleDuration = useMemo(
		(): number => sampleTimes.end - sampleTimes.start,
		[sampleTimes]
	)
	const playSelectedAudio = useCallback(() => {
		// Look at this later and see if theres a better solution
		const { start, end } = sampleTimes
		wavesurfer.current.play(start, end)
	}, [sampleTimes])

	//whenever a region is updated, update the start and end times of the region
	useEffect(() => {
		wavesurfer.current.on("region-updated", region => {
			setSampleTimes({ start: region.start, end: region.end })
		})
	}, [setSampleTimes])

	useEffect(() => {
		wavesurfer.current.on("region-mouseenter", () => {
			setIsMouseOverRegion(true)
		})
		wavesurfer.current.on("region-mouseleave", () => {
			setIsMouseOverRegion(false)
		})
	}, [setIsMouseOverRegion])

	const [allSampleData, setAllSampleData] = useState<SampleData[]>([])
	const length = useRef<number>(0)
	useEffect(() => {
		length.current = allSampleData.length
	}, [allSampleData])
	
	const createSampleObject = useCallback(
		e => {
			const sampleObject = {
				sampleSrc: URL.createObjectURL(e.data),
				name: `sample ${length.current}`,
				id: uuidv4(),
			}
			setAllSampleData(previousData => [...previousData, sampleObject])
		},
		[setAllSampleData]
	)

	useEffect(
		() => mediaRecorder?.addEventListener("dataavailable", createSampleObject),
		[mediaRecorder, createSampleObject]
	)

	const updateSampleName = useCallback(
		(name, id) => {
			// const currentSampleObject = allSampleData.find(({id}) => id === id)
			// console.log(currentSampleObject)
			const newSampleData = allSampleData.map(item => {
				if (id === item.id) {
					item.name = name
				}
				return item
			})
			console.log(newSampleData)

			setAllSampleData(newSampleData)
		},
		[allSampleData]
	)

	const removeSample = useCallback(
		(sampleId: string) =>
			setAllSampleData(
				allSampleData.filter((object: SampleData) => object.id !== sampleId)
			),
		[allSampleData, setAllSampleData]
	)

	const startRecording = useCallback(() => {
		console.log("recording started")
		playSelectedAudio()
		console.log(sampleDuration)
		if (mediaRecorder) {
			mediaRecorder.start()
			setTimeout(() => mediaRecorder.stop(), sampleDuration * 1000)
		}
	}, [sampleDuration, playSelectedAudio, mediaRecorder])

	const stopSelectedAudio = useCallback(() => {
		if (wavesurfer.current) {
			wavesurfer.current?.stop()
		}
	}, [])

	const handleDrop = useCallback(e => {
		e.preventDefault()
		const fileURL = URL.createObjectURL(e.dataTransfer.items[0].getAsFile())
		console.log(fileURL)
		wavesurfer.current.load(fileURL)
		wavesurfer.current.regions.clear()
	}, [])

	const handleWaveformClick = useCallback(() => {
		if (isMouseOverRegion === false) {
			wavesurfer.current.regions.clear()
		}
	}, [isMouseOverRegion])

	return (
		<>
			<div onMouseDown={handleWaveformClick} ref={waveFormRef}>
				{" "}
				Wave Sampler{" "}
			</div>
			<input type="range" min="20" max="1000" value={zoomValue} step='10' onInput={handleZoom} />
			<div
				ref={dropZoneRef}
				onDrop={e => handleDrop(e)}
				onDragOver={e => e.preventDefault()}
				className='dropzone'></div>
			<Controls
				playSelectedAudio={playSelectedAudio}
				stopSelectedAudio={stopSelectedAudio}
				startRecording={startRecording}
			/>
			<SampleContainer
				allSampleData={allSampleData}
				updateSampleName={updateSampleName}
				removeSample={removeSample}
			/>
		</>
	)
}
export default App
