import React from 'react'
import './Controls.css'

interface Props {
    playSelectedAudio: () => void 
    stopSelectedAudio: () => void
}



const Controls:React.FC<Props> = ({stopSelectedAudio, playSelectedAudio}) => {


    return(
        <div className="controls-container">
            <button onClick={playSelectedAudio}>Play Selected</button>
            <button onClick={stopSelectedAudio}>Stop Selected Audio</button>
            <button>Start Recording</button>
            <button> Stop Recording</button>
        </div> 
    )
}


export default Controls