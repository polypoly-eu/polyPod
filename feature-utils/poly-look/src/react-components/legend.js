class IncorrectLegendEntry extends Error {
  constructor(entry) {
    super(`«${JSON.stringify(entry)}» is not a LegendEntry`);
  }
}

class LegendEntry {
  constructor(description, color) {
    this._description = description;
    if (color.match(/^#[0-9a-fA-F]{6}$/)) {
      this._color = color;
    } else {
      throw new IncorrectLegendEntry({
        description: description,
        color: color,
      });
    }
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
    for (const l of legends) {
      if ((typeof l).name === "LegendEntry") {
        thisLegends.push(l);
      } else {
        if ("description" in l && "color" in l) {
          thisLegends.push(new LegendEntry(l.description, l.color));
        } else {
          throw new IncorrectLegendEntry(l);
        }
      }
    }
    this._legends = thisLegends;
  }

  get legends() {
    return this._legends;
  }
}

export { IncorrectLegendEntry, LegendEntry, Legend };
