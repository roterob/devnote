import * as chrono from "chrono-node";

const DATE_RE = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

export function getDateTime(line, date_re) {
  let res = null;
  const m = line.match(date_re || DATE_RE);
  if (m) {
    res = Date.parse(`${m[2]}-${m[1]}-${m[3]}`);
  }
  return res;
}

export function getHumanizedDateTime(line) {
  let res = null;
  const date = chrono.parseDate(line);
  if (date) {
    res = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
  }
  return res;
}

export function getFilterTags(cliArgs) {
  if (!cliArgs || cliArgs.length == 0) {
    return [];
  }
  const tags = [];
  for (let i = 0; i < cliArgs.length; i++) {
    const tag = cliArgs[i];
    if (tag == "--from") {
      const dateArgs = cliArgs.slice(i + 1).join(" ");
      return [tags, getDateTime(dateArgs) || getHumanizedDateTime(dateArgs)];
    } else {
      tags.push(tag);
    }
  }
  return [tags];
}
