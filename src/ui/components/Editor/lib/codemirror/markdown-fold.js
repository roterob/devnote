// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function (mod) {
  if (typeof exports == "object" && typeof module == "object")
    // CommonJS
    mod(require("codemirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd)
    // AMD
    define(["codemirror/lib/codemirror"], mod);
  // Plain browser env
  else mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.registerHelper("fold", "markdown", function (cm, start) {
    var maxDepth = 100;

    function isHeader(lineNo) {
      var tokentype = cm.getTokenTypeAt(CodeMirror.Pos(lineNo, 0));
      return tokentype && /\bheader\b/.test(tokentype);
    }

    function listLevel(lineNo) {
      var line = cm.getLine(lineNo);
      var res = -1;
      if (line && line.match(/^(\s*)(\+|-|\*|\d+\.)? /)) {
        res = RegExp.$1.length;
      }
      return res;
    }

    function isTagSection(lineNo) {
      return cm.getLine(lineNo).startsWith("--- #");
    }

    function headerLevel(lineNo, line, nextLine) {
      var match = line && line.match(/^#+/);
      if (match && isHeader(lineNo)) return match[0].length;
      match = nextLine && nextLine.match(/^[=\-]+\s*$/);
      if (match && isHeader(lineNo + 1)) return nextLine[0] == "=" ? 1 : 2;
      return maxDepth;
    }

    var firstLine = cm.getLine(start.line),
      nextLine = cm.getLine(start.line + 1);
    var hLevel = headerLevel(start.line, firstLine, nextLine);
    if (hLevel !== maxDepth) {
      var lastLineNo = cm.lastLine();
      var end = start.line,
        nextNextLine = cm.getLine(end + 2);
      while (end < lastLineNo) {
        if (
          headerLevel(end + 1, nextLine, nextNextLine) <= hLevel ||
          isTagSection(end + 1)
        ) {
          break;
        }
        ++end;
        nextLine = nextNextLine;
        nextNextLine = cm.getLine(end + 2);
      }

      return {
        from: CodeMirror.Pos(start.line, firstLine.length),
        to: CodeMirror.Pos(end, cm.getLine(end).length),
      };
    } else {
      var lLevel = listLevel(start.line);
      if (lLevel >= 0 && lLevel < listLevel(start.line + 1)) {
        var lastLineNo = cm.lastLine();
        var end = start.line + 1;
        while (end < lastLineNo) {
          if (listLevel(end + 1) <= lLevel) {
            break;
          }
          ++end;
        }

        return {
          from: CodeMirror.Pos(start.line, firstLine.length),
          to: CodeMirror.Pos(end, cm.getLine(end).length),
        };
      }

      return undefined;
    }
  });
});
