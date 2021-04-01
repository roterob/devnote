function document(md, parent) {
  const MAX_LINES_TO_SHOW = 1000;
  const document = parent ? parent.getDocument() : {};
  const tagIndex = parent ? parent.getTagIndex() : {};
  let msCounter = parent ? parent.getMsCounter() : 0; // used for generate section unique ids.
  let filteredDocument = {};
  let me = null;

  function addTagIndex(tag, sectionId) {
    const list = tagIndex[tag] || [];
    list.push(sectionId);
    tagIndex[tag] = list;
  }

  function buildDocument(md) {
    const TAG_RE = /#([\w-_0-9\/]*)\b/g;
    const DATE_RE = /#(\d{2})\/(\d{2})\/(\d{4})/;
    const lines = md.split(/\r?\n/);
    let blockLines = [];
    let tags = [];
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
          addTagIndex(tag, dateMS);
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

    for (let line of lines) {
      if (line.startsWith("--- #")) {
        addSection();
        tags = [...line.matchAll(TAG_RE)].map((m) => m[1]);
        msCounter += 1;
        const [ms, tagFound] = getSectionDateInMS(line);
        // to keep seccion order and uniqueness
        dateMS = ms + msCounter;
        if (!tagFound) {
          const dateString = new Date(dateMS).toLocaleDateString();
          tags.push(dateString);
          line += ` #${dateString}`;
        }
        blockLines = [line];
      } else {
        blockLines.push(line);
      }
    }
    addSection();
  }

  function applyFilters(tags, from) {
    let sections = [];

    if (!tags || tags.length == 0) {
      sections = Object.keys(document);
    } else {
      tags.forEach((tag) => {
        const index = tagIndex[tag];
        if (index) {
          Array.prototype.push.apply(sections, index);
        }
      });
    }

    sections.sort();
    if (from) {
      const fromIndex = sections.findIndex((t) => t >= from);
      sections = fromIndex >= 0 ? sections.slice(fromIndex) : [];
    }

    return sections;
  }

  function filter(tags, from) {
    const sections = applyFilters(tags, from);
    filteredDocument = {};
    const mdContent = [];

    sections.forEach((sectionId) => {
      const section = document[sectionId];
      filteredDocument[sectionId] = section;
      mdContent.push(section.md);
    });

    return mdContent.join("\n");
  }

  function removeFilteredSections() {
    Object.values(filteredDocument).forEach((section) => {
      section.tags.forEach((tag) => {
        tagIndex[tag] = tagIndex[tag].filter((t) => t !== tag);
      });
      delete document[section.id];
    });
    filteredDocument = {};
  }

  function updateCurrentSections(md) {
    removeFilteredSections();
    document(md, me);
  }

  buildDocument(md);

  me = {
    getDocument: () => document,
    getTagIndex: () => tagIndex,
    getFilteredSections: () => filteredDocument,
    getMsCounter: () => msCounter,
    filter,
    updateCurrentSections,
  };

  return me;
}

export default document;
