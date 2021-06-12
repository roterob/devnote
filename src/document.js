import { getDateTime } from "./utils";

const EMPTY_SECTION = {
  id: 0,
  tags: [],
  md: ""
};

function mdDocument(md) {
  let document = {},
    tagIndex = {},
    msCounter = 0,
    filteredDocument = {};
  let me = null;

  function addTagIndex(tag, sectionId) {
    const list = tagIndex[tag] || new Set();
    list.add(sectionId);
    tagIndex[tag] = list;
  }

  function reset() {
    document = {};
    tagIndex = {};
    msCounter = 0;
    filteredDocument = {};
  }

  function buildDocument(md) {
    const sectionsAdded = [];
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
        sectionsAdded.push(dateMS);
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
    document[EMPTY_SECTION.id] = EMPTY_SECTION;
    return sectionsAdded;
  }

  function applyFilters(tags, from, last) {
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

    if (last) {
      const fromIndex = sections.length - last;
      sections = fromIndex >= 0 ? sections.slice(fromIndex) : [];
    }

    if (sections.length == 0) {
      sections.push(EMPTY_SECTION.id);
    }

    return sections;
  }

  function buildFilteredDocument(sections) {
    filteredDocument = {};
    const mdContent = [];

    sections.forEach((sectionId) => {
      const section = document[sectionId] || EMPTY_SECTION;
      filteredDocument[sectionId] = section;
      mdContent.push(section.md);
    });

    return mdContent.join("\n");
  }

  function filter(tags, from, last) {
    const sections = applyFilters(tags, from, last);
    return buildFilteredDocument(sections);
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
    if (filteredSections == 0) {
      reset();
      buildDocument(md);
    } else {
      removeFilteredSections();
      const sectionsAdded = buildDocument(md);
      buildFilteredDocument(sectionsAdded);
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
