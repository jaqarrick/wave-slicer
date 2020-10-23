import React from "react"

interface Props {
	sampleSrc: string
	name: string
	sampleId: string
	removeSample: (sampleid: string) => void
	updateSampleName: (name: string, id: string) => void
}

const Sample: React.FC<Props> = ({
	removeSample,
	name,
	sampleSrc,
	sampleId,
	updateSampleName,
}) => (
	<div>
		<audio controls={true} src={sampleSrc} />
		<a href={sampleSrc} download={`${name}.wav`}>
			download
		</a>
		<button onClick={() => removeSample(sampleId)}> remove </button>
		<input
			type='text'
			value={name}
			onChange={(event: { target: HTMLInputElement }) =>
				updateSampleName(event.target.value, sampleId)
			}></input>
	</div>
)

export default Sample
