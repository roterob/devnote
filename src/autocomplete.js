

function autocomplete(input, document) {
  let baseAutocomplete = '';
  let termToAutocomplete = '';
  let options = [];
  let index = 0;

  const modes = [
    {
      regex: /f(ilter)?\s+([\w\-_0-9\/]*\s+)*(?<term>[\w\-_0-9\/]*)/,
      getProposedValues: () =>
        Object.keys(document.getTagIndex()).filter((tag) =>
          tag.startsWith(termToAutocomplete)
        ),
    },
    {
      regex: /f(ilter)?\s+(.*?)--(?<term>[\w\-_0-9\/]*)$/,
      getProposedValues: () =>
        ["paginate", "from", "last"].filter((tag) =>
          tag.startsWith(termToAutocomplete)
        ),
    },
  ];

  for (const mode of modes) {
    const matches = input.value.match(mode.regex);
    if (matches) {
      termToAutocomplete = matches.groups.term;
      baseAutocomplete = input.value.replace(new RegExp(`${termToAutocomplete}$`), "");
      options = mode.getProposedValues();
    }
  }

  function next() {
    if (options.length > 0) {
      const termProposed = `${baseAutocomplete}${options[index]}`;
      index = ++index % options.length;
      input.value = termProposed;
    }
  }

  function previous() {
    if (options.length > 0) {
      const termProposed = `${baseAutocomplete}${options[index]}`;
      index = index == 0 ? options.length - 1 : index - 1;
      input.value = termProposed;
    }
  }

  return {
    next,
    previous
  }
}

export default autocomplete;
