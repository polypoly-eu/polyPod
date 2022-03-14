class IncorrectLegendEntry extends Error {
  constructor(entry) {
    super(`«${JSON.stringify(entry)}» is not a LegendEntry`);
  }
}

class LegendEntry {
  constructor(description, color) {
    this._description = description;
    if (!color.match(/^#[0-9a-fA-F]{6}$/)) {
      throw new IncorrectLegendEntry({
        description: description,
        color: color,
      });
    }
    this._color = color;
  }

  get description() {
    return this._description;
  }

  get color() {
    return this._color;
  }
}

class Legend {
  constructor(legends) {
    let thisLegends = [];
    for (const legend of legends) {
      if (legend.constructor.name === "LegendEntry") {
        thisLegends.push(l);
        return;
      }
      if (
        legend.hasOwnProperty("description") &&
        legend.hasOwnProperty("color")
      ) {
        thisLegends.push(new LegendEntry(legend.description, legend.color));
      } else {
        throw new IncorrectLegendEntry(l);
      }
    }
    this._legends = thisLegends;
  }

  get legends() {
    return this._legends;
  }
}

export { IncorrectLegendEntry, LegendEntry, Legend };
