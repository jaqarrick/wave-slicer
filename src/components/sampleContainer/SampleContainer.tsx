import styled from "@emotion/styled";
import React from "react";
import Sample from "./sample/Sample";

const SampleContainerWrapper = styled.div`
  width: 100%;
  height: 30vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: scroll;
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
