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

function getCliParam(cliArgs, from) {
  const params = []
  let i = from;
  while(i<cliArgs.length && !cliArgs[i].startsWith("--")) {
    params.push(cliArgs[i]);
    i++;
  }
  return [params, i];
}

export function getFilterTags(cliArgs) {
  if (!cliArgs || cliArgs.length == 0) {
    return [];
  }
  const tags = [];
  let from = null;
  let last = null;
  let paginate = false;
  for (let i = 0; i < cliArgs.length;) {
    const tag = cliArgs[i];
    if (tag == "--from") {
      let dateParams = [];
      [dateParams, i] = getCliParam(cliArgs, ++i);
      const dateArgs = dateParams.join(" ");
      from = getDateTime(dateArgs) || getHumanizedDateTime(dateArgs);
    } else if (tag == "--last") {
      let lastParams = [];
      [lastParams, i] = getCliParam(cliArgs, ++i);
      last = parseInt(lastParams.join(""), 10) || 1;
    } else if (tag == "--paginate") {
      paginate = true;
      i++;
    } else {
      tags.push(tag);
      i++;
    }
  }
  return [tags, from, last, paginate];
}

export function objectId() {
  var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
}
