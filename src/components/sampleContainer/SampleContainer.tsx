import styled from "@emotion/styled";
import React from "react";
import Sample from "./sample/Sample";
import { colors } from "../../utils/style";

const SampleContainerWrapper = styled.div`
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto;
  border-top: 3px dashed ${colors.dark};
`;

interface Props {
  allSampleData: any[];
  updateSampleName: (name: string, id: string) => void;
  removeSample: (sampleid: string) => void;
}

const SampleContainer: React.FC<Props> = ({
  allSampleData,
  updateSampleName,
  removeSample,
}) => (
  <SampleContainerWrapper>
    {allSampleData.map((object) => (
      <Sample
        key={object.id}
        removeSample={removeSample}
        sampleId={object.id}
        sampleSrc={object.sampleSrc}
        name={object.name}
        updateSampleName={updateSampleName}
      />
    ))}
  </SampleContainerWrapper>
);

export default SampleContainer;
