class IncorrectLegendEntry extends Error {
  constructor(entry) {
    super(`«${JSON.stringify(entry)}» is not a LegendEntry`);
  }
}

/**
 * A legend entry.
 */
class LegendEntry {
  /**
   * Creates a new instance.
   *
   * @param description - The text of the entry.
   * @param color - The color code of the entry.
   */
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

  /**
   * The description of the entry.
   */
  get description() {
    return this._description;
  }

  /**
   * The color of the entry.
   */
  get color() {
    return this._color;
  }
}

class Legend {
  constructor(legends) {
    let thisLegends = [];
    for (const entry of legends) {
      if (entry.constructor.name === "LegendEntry") {
        thisLegends.push(entry);
        return;
      }
      if ("description" in entry && "color" in entry) {
        thisLegends.push(new LegendEntry(entry.description, entry.color));
      } else {
        throw new IncorrectLegendEntry(entry);
      }
    }
    this._legends = thisLegends;
  }

  get legends() {
    return this._legends;
  }
}

export { IncorrectLegendEntry, LegendEntry, Legend };
