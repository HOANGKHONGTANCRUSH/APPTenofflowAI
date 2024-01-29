import React, { useRef, useState } from "react";
import styled from "styled-components";

import "@tensorflow/tfjs-backend-cpu";
// import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { flatten } from "@tensorflow/tfjs-core/dist/util";

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
    left: ${({x}) => x + "px"};
    top: ${({y}) => y + "px"};
    width: ${({width}) => width + "px"};
    height: ${({height}) => height + "px"};

    border: 2px solid #FF0000; /* Thay đổi độ dày của đường viền */
    background-color: transparent;
    z-index: 20;

    &::before {
      content: "${({ classType, score }) => `${classType} ${score.toFixed(2)}%` }";
      color: #FF0000; /* Thay đổi màu chữ */
      font-weight: 500;
      font-size: 14px; /* Giảm kích thước chữ để nó vừa với hình chữ nhật */
      position: absolute;
      top: -1.5rem;
      left: 0;
    }
`;




export function ObjectDetector(props) {

  const fileInputRef = useRef();
  const imageRef =useRef();
  const [imgData, setImage] = useState(null);
  const [predictions, setpredictions] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const isEmptyPredictions = !predictions || predictions.length === 0;

 const openfilePicker =  () => {
    if(fileInputRef.current) fileInputRef.current.click();
 }

  const normalizePredictions = (predictions, imgSize) => {
    if(!predictions || !imgSize) return predictions || [] ;
    return predictions.map((predictions) => {

      const {bbox} = predictions;
      const oldX = bbox[0];
      const oldY = bbox[1];
      const oldWidth = bbox[2];
      const oldHeight = bbox[3];

      const imgWidth = imageRef.current.width;
      const imgHeight = imageRef.current.height;

      const x = (oldX * imgWidth) / imgSize.width;
      const y = (oldY  * imgHeight) / imgSize.height;
      const width = (oldWidth * imgWidth) / imgSize.width;
      const height = (oldHeight * imgHeight)/ imgSize.height;

      return { ...predictions, bbox: [x,y, width, height] };

    })
  }

  const detectObjectImage = async (imageElement, imgSize) => {
    const model = await cocoSsd.load({});
    const predictions = await model.detect(imageElement , 6);
    const normalizedPredictions = normalizePredictions(predictions, imgSize);
    setpredictions(normalizedPredictions);
    console.log("xin chao: ", predictions, imgSize);
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
    setpredictions([]);
    setLoading(true);
    const file = e.target.files[0];
    const imgData = await readImage(file);
    setImage(imgData);

    const imageElement = document.createElement("img");
    imageElement.src = imgData;

    imageElement.onload = async () => {
      const imgSize = {
        width: imageElement.width, height: imageElement.height 
      };
      await detectObjectImage(imageElement, imgSize);
      setLoading(false);
    }
 }

  return <ObjectDetectorContainer>
    <DetectorContainer>
    {imgData && <TargetImg src={imgData}  ref={imageRef}/>} 
    {!isEmptyPredictions && predictions.map((predictions, idx) => (
      <TagetBox key={idx} 
       x={predictions.bbox[0]}
       y={predictions.bbox[1]} 
       width={predictions.bbox[2]} 
       height={predictions.bbox[4]} 
       classType={predictions.class}
       score={predictions.score * 100} 
       />
    ))}
    </DetectorContainer>
    <HiddenFileInput type="file" ref={fileInputRef}  onChange={onSelectImage}/>
    <SelectButton onClick={openfilePicker}>
      {isLoading ? "Loagding..." : "Open"}
    </SelectButton>
  </ObjectDetectorContainer>
}