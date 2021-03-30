function document(md, initMsCounter = 0) {
  const MAX_LINES_TO_SHOW = 1000;
  let msCounter = initMsCounter; // used for generate section unique ids.
  const document = {};
  const currentSections = [];
  const tagIndex = {};

  function addTagIndex(tag, sectionId) {
    const list = tagIndex[tag] || [];
    list.push(sectionId);
    tagIndex[tag] = list;
  }

  function mergeTagIndex(newTagIndex) {
    Object.keys(newTagIndex).forEach(tag => {
      tagIndex[tag] = tagIndex[tag] || [];
      Array.prototype.push.apply(tagIndex[tag], newTagIndex[tag]);
    })
  }

  function buildDocument(md) {
    const TAG_RE = /#([\w-_0-9\/])*\b/g;
    const DATE_RE = /#(\d{2})\/(\d{2})\/(\d{4})/;
    const lines = md.split(/\r?\n/);
    let blockLines = [];
    let tags = new Set();
    let dateMS = null;

    function addSection() {
      if (blockLines.length > 0) {
        document[dateMS] = {
          id: dateMS,
          tags,
          date: new Date(dateMS),
          md: blockLines.join("\n"),
          nol: blockLines.length,
        };
        for (const tag of tags) {
          addTagIndex(tag, msCounter);
        }
      }
    }

    function getSectionDateInMS(sectionLine) {
      let ms = Date.now();
      let exists = false;
      const m = sectionLine.match(DATE_RE);
      if (m) {
        ms = Date.parse(`${m[2]}-${m[1]}-${m[3]}`);
        exists = true;
      }
      return [ms, exists];
    }

    for (const line of lines) {
      if (line.startsWith("--- #")) {
        addSection();
        blockLines = [line];
        tags = new Set([...line.matchAll(TAG_RE)].map((g) => g[1]));
        msCounter += 1;
        // to keep seccion order and uniqueness
        [dateMS, tagFound] = getSectionDateInMS(line) + msCounter;
        if (!tagFound) {
          tags.add(new Date(dateMS).toLocaleDateString())
        }
      } else {
        blockLines.push(line);
      }
    }
    addSection();
  }

  function filter() {
    currentSections = [];
    let numOfLines = 0;
    let current = msCounter;
    const blocks = [];
    while (current > 0 && numOfLines < MAX_LINES_TO_SHOW) {
      const section = document[current];
      numOfLines += section.nol;
      blocks.unshift(section.md);
      current -= 1;
      currentSections.push(current);
    }
    return blocks.join("\n");
  }

  function removeFilteredSections() {
    currentSections.forEach(section => {
      section.tags.forEach(tag => {
        tagIndex[tag] = tagIndex[tag].filter(t => t !== tag);
      });
      delete document[section.id];
    });
  }

  function updateCurrentSections(md) {
    removeFilteredSections();
    const subDocument = document(md, msCounter);
    const sections = Object.values(subDocument.getDocument());
    currentSections = [...sections];
    mergeTagIndex(subDocument.getTagIndex());
  }

  return {
    getDocument: () => document,
    getTagIndex: () => tagIndex,
    filter,
    updateCurrentSections
  }
}

export default document;
