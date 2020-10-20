import React, {useEffect, useState, useCallback} from "react"
import "./App.css"
import * as WaveSurfer from "../node_modules/wavesurfer.js/dist/wavesurfer"
import RegionsPlugin from '../node_modules/wavesurfer.js/dist/plugin/wavesurfer.regions'
//@ts-ignore
import sample from './garoto.mp3'
import Controls from './components/controls/Controls'

// const wavesurfer:any = WaveSurfer.create({
//   waveColor: "violet",
//   progressColor: "purple",
//   backend: "MediaElementWebAudio",
//   plugins: [
//     RegionsPlugin.create({
//       regionsMinLength: 1,
//       regions: [],
//       dragSelection: {
//         slop: 1,
//       },
//     }),
//   ],
// })

//move this into state
let wavesurfer

// const region1 = wavesurfer.addRegion({
// 	start: 1,
// 	end: 9,
// 	loop: false,
// 	color: "hsla(400, 100%, 30%, 0.5)",
// })

const App: React.FC = () => {    


    const [currentRegion, setCurrentRegion] = useState<any>(null)
    const [mediaRecorder, setMediaRecorder] = useState<null | MediaRecorder>(null)

    useEffect(() => {
      wavesurfer = WaveSurfer.create({
        container: "#wavesurfer-container",
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
      const streamDestination = wavesurfer.backend.ac.createMediaStreamDestination()
      // Creates a gainNode to use as a wavesurfer filter (just needs to be something for the audio to pass through)
      const gainNode = wavesurfer.backend.ac.createGain()
      // Connects gain node to the audio stream
      gainNode.connect(streamDestination)
      wavesurfer.backend.setFilter(gainNode)
      setMediaRecorder(new MediaRecorder(streamDestination.stream))
      wavesurfer.load('https://res.cloudinary.com/dcttcffbc/video/upload/v1602866271/samples/gosh.m4a')
    }, [])

    const [times, setTimes] = useState<{}>({start:null, stop:null})
    const playSelectedAudio = useCallback(() => {
      // Look at this later and see if theres a better solution
      let start
      let end
      for(let id in wavesurfer.regions.list) {
        start = wavesurfer.regions.list[id].start
        end = wavesurfer.regions.list[id].end
      }
      wavesurfer.play(start, end)
    }, [])


    const stopSelectedAudio = useCallback(() => wavesurfer.stop(), [])
    
    const initMediaRecorder = useCallback(async () => {
      
    },[])
    return (
    <>
        <div id='wavesurfer-container'> Wave Sampler </div>
        <Controls playSelectedAudio={playSelectedAudio} stopSelectedAudio={stopSelectedAudio} />
    </>)
}
export default App
