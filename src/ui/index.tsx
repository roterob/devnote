import React from "react";
import Editor from "./components/Editor";
import MathPreview from "./components/MathPreview";
import Excalidraw from "./components/Excalidraw";

function AppUI() {
  return (
    <>
      <MathPreview />
      <Editor />
      <Excalidraw />
    </>
  );
}

export default AppUI;
