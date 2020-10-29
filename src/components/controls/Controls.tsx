import React from "react"
// import "./Controls.css"
import styled from'@emotion/styled'

interface Props {
	playSelectedAudio: () => void
	stopSelectedAudio: () => void
	startRecording: () => void
}

const ControlsContainer = styled.div`
	background-color:red;
	width: 500px;
	display: flex;
	height: 40px;
`
const ControlButton = styled.button`
	cursor: pointer;
`


const Controls: React.FC<Props> = ({
	startRecording,
	stopSelectedAudio,
	playSelectedAudio,
}) => {
	return (
		<ControlsContainer>
			<ControlButton onClick={playSelectedAudio}>Play Selected</ControlButton>
			<ControlButton onClick={stopSelectedAudio}>Stop Selected Audio</ControlButton>
			<ControlButton onClick={startRecording}>Start Recording</ControlButton>
			<ControlButton> Stop Recording</ControlButton>
		</ControlsContainer>
	)
}

export default Controls
