import React, {useEffect, useCallback} from "react"
import "./App.css"
import * as WaveSurfer from "../node_modules/wavesurfer.js/dist/wavesurfer"
import RegionsPlugin from '../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions'
import sample from './samples/'

const wavesurfer:any = WaveSurfer.create({
	container: "#wavesurfer-container",
	waveColor: "violet",
	progressColor: "purple",
	backend: "MediaElementWebAudio",
	plugins: [
		RegionsPlugin.create({
			regionsMinLength: 1,
			regions: [],
			dragSelection: {
				slop: 1,
			},
		}),
	],
})


const App: React.FC = () => {    
    const loadSample = useCallback((sample:any) => {
        wavesurfer.load(sample)
    }, [])

    useEffect(() => loadSample(sample))
    return (<div> Wave Sampler </div>)
}
export default App
