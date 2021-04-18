import React from "react";
import Editor from "./components/Editor";
import Excalidraw from "./components/Excalidraw";
import MathPreview from "./components/MathPreview";

function AppUI() {
  return (
    <>
      <Editor />
      <MathPreview />
      <Excalidraw />
    </>
  );
}

export default AppUI;
