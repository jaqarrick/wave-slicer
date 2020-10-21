import React, { useEffect, useState, useRef, useCallback } from "react"
import "./App.css"
import * as WaveSurfer from "../node_modules/wavesurfer.js/dist/wavesurfer"
import RegionsPlugin from "../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions"
//@ts-ignore
// import sample from "./garoto.mp3"
import Controls from "./components/controls/Controls"

const App: React.FC = () => {
	const waveFormRef = useRef<any>(null)
	const wavesurfer = useRef<any>(null)
	const [mediaRecorder, setMediaRecorder] = useState<null | MediaRecorder>(null)

	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
			container: waveFormRef.current,
			waveColor: "violet",
			progressColor: "purple",
			backend: "MediaElementWebAudio",
			plugins: [
				RegionsPlugin.create({
					regionsMinLength: 1,
					maxRegions: 1,
					regions: [],
					dragSelection: {
						slop: 1,
					},
				}),
			],
		})
		// Creates a mediastream for mediaRecorder
		const streamDestination = wavesurfer.current.backend.ac.createMediaStreamDestination()

		// Creates a gainNode to use as a wavesurfer filter (just needs to be something for the audio to pass through)
		const gainNode = wavesurfer.current.backend.ac.createGain()
		// Connects gain node to the audio stream
		gainNode.connect(streamDestination)
		wavesurfer.current.backend.setFilter(gainNode)
		setMediaRecorder(new MediaRecorder(streamDestination.stream))
		wavesurfer.current.load(
			"https://res.cloudinary.com/dcttcffbc/video/upload/v1602866271/samples/gosh.m4a"
		)
	}, [])

	const playSelectedAudio = useCallback(() => {
		// Look at this later and see if theres a better solution
		let start
		let end
		for (let id in wavesurfer.current.regions.list) {
			start = wavesurfer.current.regions.list[id].start
			end = wavesurfer.current.regions.list[id].end
		}
		wavesurfer.current.play(start, end)
	}, [])

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
			/>
		</>
	)
}
export default App
