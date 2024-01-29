import React, { useRef, useState } from "react";
import styled from "styled-components";

import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const ObjectDetectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh; /* 100% chiều cao của màn hình */
  width: 25%
`;

const DetectorContainer = styled.div`
  width: 100%; /* 100% chiều rộng của cha */
  height: 100%; /* 100% chiều cao của cha */
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  position: relative;
`;

const TargetImg =  styled.img`
  width: 100%; /* 100% chiều rộng của phần tử */
  height: 100%; /* 100% chiều cao của phần tử */
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
  return <ObjectDetectorContainer>
    <DetectorContainer>
      Img
    </DetectorContainer>
    <SelectButton>
      Select IMG
    </SelectButton>
  </ObjectDetectorContainer>
}