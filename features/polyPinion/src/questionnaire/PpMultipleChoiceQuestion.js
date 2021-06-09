import assert from '../util/assert';
import PpChoiceQuestion from './PpChoiceQuestion.js';
import { i18n } from '../i18n/i18n.js';

//
// Multiple choice questions are those typically represented by
// check boxes, where the user can select or or more options.
//
// - max_selections_allowed is the maximum number of choices the
//   user can make for this question
// - Exclusion groups are defined below
//
// Exclusion Groups:
//
// Questions will often include a final option of "none of the above" or
// similar.  Exclusion Groups are a generalisation of this requirement that
// means that whenever a selection is made within a group, all choices outside
// that group are automatically deselected.
//
// Exclusion groups are repesented as a collection of groups, as an
// array of arrays.  Each group consists of the index of the member questions.
//

export default class PpMultipleChoiceQuestion extends PpChoiceQuestion {
  constructor(description) {
    super(description);
    this._max_selections_allowed = Infinity;
    this._exclusion_groups = [];
  }

  maxSelectionsAllowed() {
    if (this._max_selections_allowed == undefined ||
      this._max_selections_allowed == null) {
      return Infinity;
    } else {
      return this._max_selections_allowed;
    }
  }

  setMaxSelectionsAllowed(an_integer) {
    assert(an_integer > 1);
    this._max_selections_allowed = an_integer;
    return this;
  }

  get exclusion_groups() {
    return this._exclusion_groups;
  }

  set exclusion_groups(an_array) {
    this._exclusion_groups = an_array;
  }

  explanation() {
    if (this._explanation.length > 0) {
      return super.explanation();
    }
    if (this._max_selections_allowed == undefined ||
      this._max_selections_allowed == null ||
      this._max_selections_allowed == Infinity) {
      return i18n.t('general.choose-one-or-more');
    } else {
      return i18n.t('general.choose-up-to', {max_selections: this.maxSelectionsAllowed()});
    }
  }

  isAnswered() {
    return this.selectedChoices().length > 0;
  }

  value() {
    return this.selectedChoices().map(choice => choice.value());
  }

  screen() {
    return 'MultipleChoiceQuestion';
  }

  selectedChoices() {
    return this._choices.filter(item => item.isSelected());
  }

  selectedChoiceIds() {
    return this.selectedChoices().map(choice => choice.id);
  }

  // Answer the object to be stored in the answer json document.
  // This is the ids of selected choices.
  answer() {
    return this.selectedChoiceIds();
  }

  // The supplied choice has been selected.
  //
  // If the choice is part of an exclusion group, deselect all choices
  // that are part of other exclusion groups.
  //
  // If maxSelectionsAllowed has been reached, ensure that only the
  // selected choices are enabled.
  selectChoice(choice) {
    // Find the exclusion_group the choice is a member of
    let exclusion_group = this._exclusion_groups.find(
        group => group.find(index => index == choice.index) != undefined);
    // If none, no further action requried
    if (exclusion_group == undefined) {
      return;
    }
    // Deselect choices that are a member of other groups
    this._exclusion_groups.forEach(group => {
      if (group != exclusion_group) {
        group.forEach(choice_index => {
          if (this.choices()[choice_index].isSelected()) {
            this.choices()[choice_index].beNotSelected();
          }
        });
      }
    });
  }

  // updateEnabled()
  //
  // If maxSelectionsAllowed has been reached, ensure that only the
  // selected choices are enabled.
  //
  updateEnabled() {
    if (this.selectedChoices().length >= this.maxSelectionsAllowed()) {
      this.choices().forEach(choice => {
        choice.enabled = choice.isSelected();
      })
    } else {
      this.choices().forEach(choice => choice.enabled = true);
    }
  }

  // Update the receiver based on the supplied answer (JSON object)
  loadAnswer(answer) {
    assert(answer.questionId === this.id);
    this._choices.forEach(choice => choice.beNotSelected());
    answer.answer.forEach(value => {
      this._choices.find(choice => choice.id === value).beSelected();
    });
  }

  postJSONLoad(questionnaire) {
    super.postJSONLoad(questionnaire);
    if (this._max_selections_allowed == null) {
      this._max_selections_allowed = Infinity;
    }
  }

}
