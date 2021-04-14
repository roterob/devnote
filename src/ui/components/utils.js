

export function searchStyle (cm, line, style) {
  const handle = cm.getLineHandle(line);
  let lastChar = 0;
  for (const styleIn of handle.styles) {
    if (typeof styleIn === "number") {
      lastChar = styleIn;
    } else if (styleIn && styleIn.indexOf(style) >= 0) {
      return lastChar;
    }
  }
  return 0;
};

export function getCursorPosition (cm, exp) {
  const cursor = cm.getCursor();
  let { line, ch } = cursor;
  let width = "auto";
  let lineContent = cm.getLine(line);
  let isBlock = lineContent == exp || lineContent.startsWith("$$");
  if (isBlock) {
    ch = 0;
    width = "90%";
    let index = searchStyle(cm, line, "formatting-math-end");
    while (index == 0) {
      line += 1;
      index = searchStyle(cm, line, "formatting-math-end");
    }
  } else {
    let index = lineContent.indexOf(exp) + exp.length + 1;
    while (ch > index) {
      index = lineContent.indexOf(exp, index) + exp.length + 1;
    }
    ch = index - exp.length - 1;
  }

  return { ...cm.charCoords({ line, ch }, "window"), width };
};
