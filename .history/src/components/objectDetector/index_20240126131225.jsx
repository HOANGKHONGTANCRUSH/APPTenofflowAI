import React, { useRef, useState } from "react";
import styled from "styled-components";

import "@tensorflow/tfjs-backend-cpu";
//import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";


const ObjectDetectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetectorContainer = styled.div`
  min-width: 200px;
  height: 500px;
  border: 3px solid #fff;
  border: flex;
  display: flex;
  align-items: center;
  position: relative;
`;

const TargetImg =  styled.img`
  height: 100%;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const SelectButton = styled.button`
  padding: 7px 10px;
  border: 2px solid transparent;
  background-color; #fff;
  color: #0a0f22;
  font-weight; 500;
  outline: none;
  margin-top: 2em;
  cursor: pointer;
  transition: all 260ms ease-in-out;

  &:hover {
    background-color: transparent;
    border: 2px solid: #fff;
    color: #fff;
  }
`;



export function ObjectDetector(props) {
  return <ObjectDetectorContainer>
    <ObjectDetector>
      Img
    </ObjectDetector>
    <SelectButton>
      Select IMG
    </SelectButton>
  </ObjectDetectorContainer>
}