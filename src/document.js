import { getDateTime } from "./utils";

function mdDocument(md, parent) {
  let document, tagIndex, msCounter, filteredDocument;
  let me = null;

  function addTagIndex(tag, sectionId) {
    const list = tagIndex[tag] || new Set();
    list.add(sectionId);
    tagIndex[tag] = list;
  }

  function buildDocument(md) {
    document = parent ? parent.getDocument() : {};
    tagIndex = parent ? parent.getTagIndex() : {};
    msCounter = parent ? parent.getMsCounter() : 0; // used for generate section unique ids.
    filteredDocument = {};

    const TAG_RE = /#([\w-_0-9\/]*)\b/g;
    const DATE_RE = /#(\d{1,2})\/(\d{1,2})\/(\d{4})/;
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
        if (parent) {
          parent.setMsCounter(msCounter);
        }
      }
    }

    function getSectionDateInMS(sectionLine) {
      let ms = getDateTime(sectionLine, DATE_RE);
      let exists = true;

      if (!ms) {
        exists = false;
        ms = Date.now();
      }
      return [ms, exists];
    }

    for (let line of lines) {
      if (line.startsWith("--- #")) {
        msCounter += 1;
        addSection();
        tags = [...line.matchAll(TAG_RE)].map((m) => m[1]);
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
          Array.prototype.push.apply(sections, [...index]);
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
        tagIndex[tag].delete(section.id);
      });
      delete document[section.id];
    });
    filteredDocument = {};
  }

  function updateCurrentSections(md) {
    const filteredSections = Object.keys(filteredDocument).length;
    if (filteredSections == 0 || filteredSections == Object.keys(document).length) {
      buildDocument(md);
    } else {
      removeFilteredSections();
      const auxDoc = mdDocument(md, me);
    }
  }

  function toString() {
    const sections = Object.keys(document).sort();
    const mdContent = [];
    sections.forEach((sectionId) => {
      mdContent.push(document[sectionId].md);
    });
    return mdContent.join("\n");
  }

  buildDocument(md);

  me = {
    getDocument: () => document,
    getTagIndex: () => tagIndex,
    getFilteredSections: () => filteredDocument,
    getMsCounter: () => msCounter,
    setMsCounter: (counter) => msCounter = counter,
    filter,
    updateCurrentSections,
    toString,
  };

  return me;
}

export default mdDocument;
