import React, { useRef, useState } from "react";
import styled from "styled-components";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const DoituongContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DoContainer = styled.div`
  min-width: 200px;
  height: 700px;
  border: 3px solid #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MucTieuanh = styled.img`
height: 100%;
${({ hidden }) => hidden && 'display: none;'}
`;

const AnFileInput = styled.input`
  display: none;
`;

const Nut = styled.button`
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

const Hop = styled.div`
    position: absolute;
    left: ${({x}) => x + "px"};
    top: ${({y}) => y + "px"};
    width: ${({width}) => width + "px"};
    height: ${({height}) => height + "px"};

    border: 2px solid #FF0000; 
    background-color: transparent;
    z-index: 20;

    &::before {
      content: "${({ classType, score }) => `${classType} ${score.toFixed(2)}%` }";
      color: #FF0000;
      font-weight: 500;
      font-size: 14px; 
      position: absolute;
      top: -1.5rem;
      left: 0;
    }
`;




export function ObjectDetector(props) {

  const fileInputRef = useRef();
  const imageRef =useRef();
  const [imgData, setImage] = useState(null);
  const [Doan, setDoan] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const isEmptyDoan = !Doan || Doan.length === 0;

 const openfilePicker =  () => {
    if(fileInputRef.current) fileInputRef.current.click();
 }

  const normalizeDoan = (Doan, imgSize) => {
    if(!Doan || !imgSize) return Doan || [] ;
    return Doan.map((Doan) => {

      const {bbox} = Doan;
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

      return { ...Doan, bbox: [x,y, width, height] };

    })
  }

  const PhathienHanh = async (imageElement, imgSize) => {
    const model = await cocoSsd.load({});
    const Doan = await model.detect(imageElement, 6);
    const normalizedDoan = normalizeDoan(Doan, imgSize);
    setDoan(normalizedDoan);
    console.log("xin chào: ", Doan, imgSize);
  };

  const Docimage = (file) => {
    return new Promise((rs, r) =>{
      const fileReader = new FileReader();
      fileReader.onload = () => rs(fileReader.result);
      fileReader.onerror = () => r(fileReader.error);
      fileReader.readAsDataURL(file);
    })
  }


 const onSelectImage = async (e) => {
    setDoan([]);
    setLoading(true);
    const file = e.target.files[0];
    const imgData = await Docimage(file);
    setImage(imgData);

    const imageElement = document.createElement("img");
    imageElement.src = imgData;

    imageElement.onload = async () => {
      const imgSize = {
        width: imageElement.width, height: imageElement.height 
      };
      await PhathienHanh(imageElement, imgSize);
      setLoading(false);
    }
 }

 return (
  <DoituongContainer>
    <DoContainer>
      <MucTieuanh src={imgData} ref={imageRef} hidden={!imgData} />
      {!isEmptyDoan &&
        Doan.map((Doan, idx) => (
          <Hop
            key={idx}
            x={Doan.bbox[0]}
            y={Doan.bbox[1]}
            width={Doan.bbox[2]}
            height={Doan.bbox[3]}
            classType={Doan.class}
            score={Doan.score * 100}
          />
        ))}
    </DoContainer>
    <AnFileInput type="file" ref={fileInputRef} onChange={onSelectImage} />
    <Nut onClick={openfilePicker}>
      {isLoading ? "Loading..." : "Open"}
    </Nut>
  </DoituongContainer>
);
}