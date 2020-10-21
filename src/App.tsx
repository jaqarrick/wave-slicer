import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import "./App.css"
import * as WaveSurfer from "../node_modules/wavesurfer.js/dist/wavesurfer"
import RegionsPlugin from "../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions"
//@ts-ignore
// import sample from "./garoto.mp3"
import Controls from "./components/controls/Controls"
import { SampleTimesObject } from "./types"
import SampleContainer from './components/sampleContainer/SampleContainer'


const App: React.FC = () => {
	const waveFormRef = useRef<any>(null)
	const wavesurfer = useRef<any>(null)
	const [mediaRecorder, setMediaRecorder] = useState<null | MediaRecorder>(null)

	//Initial App Render: setup wavesurfer object and connect ac backend to Media Recorder
	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
			container: waveFormRef.current,
			waveColor: "violet",
			progressColor: "purple",
			backend: "MediaElementWebAudio",
			plugins: [
				RegionsPlugin.create({
					regionsMinLength: 0.0001,
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
	}, [])

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
		wavesurfer.current.on("region-updated", (region) => {
			setSampleTimes({start: region.start, end: region.end})
		})
	}, [setSampleTimes])

	const [allSampleData, setAllSampleData] = useState<any[]>([])
	const length = useRef<number>(0)
	useEffect(()=> {
		length.current = allSampleData.length
	}, [allSampleData])
	useEffect(()=> {
		mediaRecorder?.addEventListener("dataavailable", e => {	
			const sampleObject = {
				sampleSrc: URL.createObjectURL(e.data),
				name: `sample ${length.current}`,
				id: length.current
			}
			setAllSampleData(previousData => [...previousData, sampleObject])
		})
	}, [mediaRecorder, setAllSampleData])

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

	return (
		<>
			<div ref={waveFormRef}> Wave Sampler </div>
			<Controls
				playSelectedAudio={playSelectedAudio}
				stopSelectedAudio={stopSelectedAudio}
				startRecording={startRecording}
			/>
      		<SampleContainer allSampleData={allSampleData} />

		</>
	)
}
export default App
