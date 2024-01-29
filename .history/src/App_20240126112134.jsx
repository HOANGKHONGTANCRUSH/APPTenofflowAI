import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { ObjectDetector } from "./components/objectDetector";

const AppContainer = styled.div`
 
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
      hello
    </AppContainer>
  );
}

export default App;
