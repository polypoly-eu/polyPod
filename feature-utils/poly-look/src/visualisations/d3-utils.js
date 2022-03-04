import * as d3 from "d3";

/**
 *  Wraps d3-texts on whitespaces
 *
 *  To be called like so: textSelection.call(wrapTexts)
 *
 * @param {d3-text-selection} texts
 */
export function wrapTexts(texts) {
  texts.each(function () {
    let text = d3.select(this),
      rectWidth = +text.attr("data-width"),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = 0,
      dy = 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > rectWidth) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 2)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

/**
 * Only keeps Day, Month and Yar from a date
 *
 * @param {Date} Date
 * @returns Date
 */
export function trimTimeOfDate(jsDate) {
  const date = `${jsDate.getFullYear()}-${
    jsDate.getMonth() + 1
  }-${jsDate.getDate()}`;

  return d3.timeParse("%Y-%m-%d")(date);
}
