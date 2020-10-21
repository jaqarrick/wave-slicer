import React from 'react'
import Sample from './sample/Sample'

interface Props{
  allSampleData: any[]
}

 const SampleContainer:React.FC<Props> = ({allSampleData}) => 
    <div>
      {allSampleData.map(object => 
        <Sample key={object.id} sampleSrc={object.sampleSrc} name={object.name} />
      )}
    </div>
  

export default SampleContainer