import React, {useEffect, useRef} from 'react'

interface Props {
    initWavesurfer:(waveformRef:React.RefObject<HTMLDivElement>)=>void
    handleWaveformClick: ()=>void
    handleZoom: (e:React.ChangeEvent<HTMLInputElement>)=>void
    zoomValue: number
    handleDrop: (e:any) => void
}

const WaveformWrapper:React.FC<Props> = ({initWavesurfer, handleWaveformClick, handleZoom, zoomValue, handleDrop}) => {
    const waveformRef = useRef<HTMLDivElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{
      if(waveformRef.current !== null) {
        initWavesurfer(waveformRef)
      }
    },[initWavesurfer])


    return(
        <>
            <div onMouseDown={handleWaveformClick} ref={waveformRef}>
				{" "}
				Wave Sampler{" "}
			</div>
      <input type="range" min="20" max="1000" value={zoomValue} step='10' onInput={handleZoom} />
      <div
				ref={dropZoneRef}
				onDrop={e => handleDrop(e)}
				onDragOver={e => e.preventDefault()}
				className='dropzone'></div>
        </>
    )
}

export default WaveformWrapper