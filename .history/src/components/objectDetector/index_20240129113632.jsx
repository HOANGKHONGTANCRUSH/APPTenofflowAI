import React, { useRef, useState } from "react";
import styled from "styled-components";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const ObjectDetectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetectorContainer = styled.div`
  min-width: 200px;
  height: 700px;
  border: 3px solid #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const TargetImg = styled.img`
  height: 100%;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectButton = styled.button`
  padding: 7px 10px;
  border: 2px solid transparent;
  background-color: #fff;
  color: #0a0f22;
  font-weight: 500;
  outline: none;
  margin-top: 2em;
  cursor: pointer;
  transition: all 260ms ease-in-out;
  font-size: 16px;

  &:hover {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
  }
`;

const TagetBox = styled.div`
    position: absolute;
    left: ${({left}) => left + "px"};+
    top: ${({top}) => top + "px"};
    width: ${({width}) => width + "px"};
    height: ${({height}) => height + "px"};

    border: 4px solid red;
    background-color: transparent;
    z-index: 20;

    &::before{
      content: "${({ classType, score }) => `${classType} ${score.toFixed(2)}` }";
      color: red;
      font-weight: 500;
      font-size: 17px;
      position: absolute;
      top: -1.5rem;
      left: -5px;
    }
`;



export function ObjectDetector(props) {

  const fileInputRef = useRef();
  const imageRef =useRef();
  const [imgData, setImage] = useState(null);
  const [predictions, setpredictions] = useState(null);

  const isEmptyPredictions = !predictions || predictions.length === 0;

 const openfilePicker =  () => {
    if(fileInputRef.current) fileInputRef.current.click();
 }

  const detectObjectImage = async (imageElement) => {
    const model = await cocoSsd.load({});
    const predictions = await model.detect(imageElement , 6);
    setpredictions(predictions);
    console.log("xin chao: ", predictions)
  }

  const readImage = (file) => {
    return new Promise((rs, r) =>{
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => r(fileReader.error);
      fileReader.readAsDataURL(file);
    })
  }


 const onSelectImage = async (e) => {
    const file = e.target.files[0];
    const imgData = await readImage(file);
    setImage(imgData);

    const imageElement = document.createElement("img");
    imageElement.src = imgData;

    imageElement.onload = async () => {
      await detectObjectImage(imageElement);
    }
 }

  return <ObjectDetectorContainer>
    <DetectorContainer>
    {imgData && <TargetImg src={imgData}  ref={imageRef}/>} 
    {!isEmptyPredictions && predictions.map((predictions, idx) => (
      <TagetBox key={idx} 
      left={predictions.bbox[0]}
       top={predictions.bbox[1]} 
       width={predictions.bbox[2]} 
       height={predictions.bbox[4]} 
       classType={predictions.class}
       score={predictions.score} 
       />
    ))}
    </DetectorContainer>
    <HiddenFileInput type="file" ref={fileInputRef}  onChange={onSelectImage}/>
    <SelectButton onClick={openfilePicker}>
      Select IMG
    </SelectButton>
  </ObjectDetectorContainer>
}