import React from 'react'


interface Props {
  sampleSrc:string
  name: string
}

const Sample:React.FC<Props> = ({name, sampleSrc}) => 
    <div>
       <audio controls={true} src={sampleSrc} />
       <a href={sampleSrc} download="sample.wav">download</a>
       <input type="text" value={name} ></input>
    </div> 
  


export default Sample