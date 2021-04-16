export function searchStyle(cm, line, style) {
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
}

export function getCmPrevLine(cm) {
  const cursor = cm.getCursor();
  let { line } = cursor;
  return cm.getLine(line - 1);
}

export function getCurrentMathExpPosition(cm) {
  const range = cm.hmd.FoldMath.editingExprPosition;
  let line = 0,
    ch = 0,
    width = "auto";

  if (range) {
    const { from, to } = range;
    const isBlock = from.line != to.line;
    if (isBlock) {
      width = "90%";
      line = to.line;
    } else {
      line = from.line;
      ch = from.ch;
    }
  }

  return { ...cm.charCoords({ line, ch }, "window"), width };
}

export function getCursorPosition(cm, exp) {
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
}
