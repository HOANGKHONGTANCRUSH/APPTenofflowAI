import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { ObjectDetector } from "./components/objectDetector";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: red;
`;

function App() {
  return (
    <AppContainer>
      <ObjectDetector />
    </AppContainer>
  );
}

export default App;
