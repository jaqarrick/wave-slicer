import React from 'react'


interface Props {
  sampleSrc:string
  name: string
  sampleId: string
  updateSampleName: (name:string, id:string) => void
}

const Sample:React.FC<Props> = ({name, sampleSrc, sampleId, updateSampleName}) => 
    <div>
       <audio controls={true} src={sampleSrc} />
       <a href={sampleSrc} download={`${name}.wav`}>download</a>
       <input type="text" value={name} onChange={(event: {target: HTMLInputElement}) => updateSampleName(event.target.value, sampleId)} ></input>
    </div> 
  


export default Sample