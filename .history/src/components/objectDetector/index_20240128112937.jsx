import React, { useRef, useState } from "react";
import styled from "styled-components";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const ObjectDetectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh; 
  width: 25%
`;

const DetectorContainer = styled.div`
  width: 700px; 
  height: 800px; 
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const TargetImg = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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

  &:hover {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
  }
`;



export function ObjectDetector(props) {

  const fileInputRef = useRef();
  const [imgData, setImage] = useState(null);

 const openfilePicker =  () => {
    if(fileInputRef.current) fileInputRef.current.click();
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
 }

  return <ObjectDetectorContainer>
    <DetectorContainer>
    {imgData && <TargetImg src={imgData}/>} 
    </DetectorContainer>
    <HiddenFileInput type="file" ref={fileInputRef}  onChange={onSelectImage}/>
    <SelectButton onClick={openfilePicker}>
      Select IMG
    </SelectButton>
  </ObjectDetectorContainer>
}