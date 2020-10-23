import React from "react"
import Sample from "./sample/Sample"

interface Props {
	allSampleData: any[]
	updateSampleName: (name: string, id: string) => void
	removeSample: (sampleid: string) => void
}

const SampleContainer: React.FC<Props> = ({
	allSampleData,
	updateSampleName,
	removeSample,
}) => (
	<div>
		{allSampleData.map(object => (
			<Sample
				key={object.id}
				removeSample={removeSample}
				sampleId={object.id}
				sampleSrc={object.sampleSrc}
				name={object.name}
				updateSampleName={updateSampleName}
			/>
		))}
	</div>
)

export default SampleContainer
