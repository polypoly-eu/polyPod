import assert from '../util/assert';
import v1 from 'uuid';
import PpQObject from './PpQObject.js';
import localizedDate from './localizedDate.js';

//import { timingSafeEqual } from 'crypto';

//
// PpQuestionnaire
//
// Instance Variables:
//
// - _title: The title of the questionnaire
// - _description: Text introducing the questionnaire
// - _published_date: The date the questionnaire is scheduled to be made
//   available
// - _question_language: is the language used by PpDependOnLanguage
//   to activate / deactivate questions.
//   The format is <languageCode>[_<countryCode>],
//   e.g. "en" or "en_AU".  String encoding may be present and is
//   ignored, e.g. "en_AU.UTF-8".
//   This is currently the same as the display language (and is set
//   when the display language is set), but notionally could be separate
//   at some point in the future.
// - _available_translations is a simple object containing
//   the translations that can be loaded for the questionnaire.
//   e.g. { english: 'en', german: 'de' }
//   will look for en.js in the questionnaire directory.
// - _last_saved_time - the time at which the answers document was last
//   retrieved.
// - _last_submitted_time - the time at which the answers were last
//   submitted to the server.
// - _submission_deadline - is a Date object representing the submission
//   deadline date.
// - _encryption_public_key - a public key to encrypt answers before submitting them
//

export default class PpQuestionnaire extends PpQObject {
  constructor() {
    super();
    this._id = v1();
    this._date_generated = new Date();
    this._title = null;
    this._description = null;
    this._published_date = null;
    this._author = null;
    this._legal = null;
    this._questions = [];
    this._question_language = null;
    this._available_translations = null;
    this._last_saved_time = null;
    this._last_submitted_time = null;
    this._submission_deadline = null;
    this._encryption_public_key = null;
    this._result = null;
    this._schema = null;
  }

  get id() {
    return this._id;
  }

  set id(newId) {
    this._id = newId;
  }

  activeQuestions() {
    return this._questions.filter(item => item.isActive());
  }

  questions() {
    return this._questions;
  }

  firstActiveQuestion() {
    return this.activeQuestions()[0];
  }

  get question_language() {
    return this._question_language;
  }

  set question_language(language) {
    this._question_language = language;
  }

  get available_translations() {
    return this._available_translations;
  }

  set available_translations(translations) {
    this._available_translations = translations;
  }

  get last_saved_time() {
    return this._last_saved_time;
  }

  get last_submitted_time() {
    return this._last_submitted_time;
  }

  submittedTimeString(locale) {
    return localizedDate(new Date(this._last_submitted_time), locale);
  }

  get submission_deadline() {
    return this._submission_deadline;
  }

  set submission_deadline(date) {
    this._submission_deadline = date;
  }

  submissionDeadlineString(locale) {
    return localizedDate(this._submission_deadline, locale);
  }

  get encryption_public_key() {
    return this._encryption_public_key;
  }

  set encryption_public_key(key) {
    this._encryption_public_key = key;
  }

  get result() {
    return this._result;
  }

  set result(newResult) {
    this._result = newResult;
  }

  get title() {
    return this._title;
  }

  set title(newTitle) {
    this._title = newTitle;
  }

  get description() {
    return this._description;
  }

  set description(description) {
    this._description = description;
  }

  get published_date() {
    return this._published_date;
  }

  set published_date(published_date) {
    this._published_date = published_date;
  }

  publishedDateString(locale) {
    return localizedDate(this._published_date, locale);
  }

  get author() {
    return this._author;
  }

  set author(author) {
    this._author = author;
  }

  get legal() {
    return this._legal;
  }

  set legal(legal) {
    this._legal = legal;
  }

  get schema() {
    return this._schema;
  }

  set schema(schema) {
    this._schema = schema;
  }

  // Answer the active question prior to the supplied question.
  // If the supplied question is the first question, answer null.
  // If the question can't be found, throw an error.
  activeQuestionBefore(a_question) {
    let index = a_question.index;

    do {
      index = index - 1;
    } while (index >= 0 && !this._questions[index].isActive());

    if (index < 0) {
      return null;
    }
    return this._questions[index];
  }

  isFirstQuestion(a_question) {
    return this.firstActiveQuestion() === a_question;
  }

  isLastQuestion(a_question) {
    return (
      this.activeQuestions()[this.activeQuestions().length - 1] === a_question
    );
  }

  // Answer the active question after the supplied question.
  // If the supplied question is the last question, answer null.
  // If the question can't be found, throw an error.
  activeQuestionAfter(a_question) {
    let index = a_question.index;

    do {
      index = index + 1;
    } while (
      index < this._questions.length &&
      !this._questions[index].isActive()
    );

    if (index > this._questions.length) {
      return null;
    }
    return this._questions[index];
  }

  // Answer the question with the supplied id
  questionId(qId) {
    return this._questions.find(question => question.id === qId);
  }

  addQuestion(question) {
    this._questions[this._questions.length] = question;
    question.questionnaire = this;
    this.reindex();
    return this;
  }

  // Return the array of all answered questions
  answeredQuestions() {
    return this._questions.filter(question => question.isAnswered());
  }

  // Return the first active, unanswered question,
  // or null if all have been answered or aren't active.
  firstUnansweredQuestion() {
    let firstUnanswered = this._questions.find(
      question => !question.isAnswered() && question.isActive(),
    );
    return firstUnanswered || null;
  }

  // Return the last answered question
  // Simplistic implementation for now
  lastAnsweredQuestion() {
    let answeredQuestions = this.answeredQuestions();
    if (answeredQuestions.length === 0) {
      return null;
    }
    return answeredQuestions[answeredQuestions.length - 1].index;
  }

  hasAnsweredQuestions() {
    return (
      this.answeredQuestions() !== null && this.answeredQuestions().length > 0
    );
  }

  updateSavedTime() {
    this._last_saved_time = new Date();
  }

  updateSubmittedTime() {
    this._last_submitted_time = new Date();
  }

  isSubmitted() {
    return this._last_submitted_time !== null;
  }

  isActive() {
    return !this.isExpired() && !this.isSubmitted();
  }

  isExpired() {
    const currentDate = new Date();
    return this._submission_deadline < currentDate;
  }

  hasResult() {
    return this._result !== null;
  }

  // Set the index number of all the receiver's questions
  reindex() {
    this._questions.forEach((question, index) => {
      question.index = index;
    });
    return this;
  }

  // Answer an object containing just the user's answers.
  // Note that this call doesn't update the last saved time.
  // Normally answerJSON() will be used to retrieve the document for
  // saving.
  basicAnswerJSON() {
    let jsonObject = {};
    jsonObject.schema = this.schema;
    jsonObject.questionnaireId = this.id;
    jsonObject.answers = this.questions().map(question => {
      return {questionId: question.id, answer: question.answer()};
    });
    // The langauge is set each time the application starts and when the user
    // chooses a language, thus the language included with the answers is the
    // one at the time the answers are submitted.  While answering questions a
    // different language may have been used.
    jsonObject.language = this.question_language;
    return jsonObject;
  }

  answerJSON() {
    this.updateSavedTime();
    let jsonObject = this.basicAnswerJSON();
    jsonObject._last_saved_time = this.last_saved_time;
    jsonObject._last_submitted_time = this.last_submitted_time;
    jsonObject._question_language = this._question_language;
    return jsonObject;
  }

  answerJSONForSubmit() {
    let jsonObject = this.basicAnswerJSON();
    return jsonObject;
  }

  // Update the receiver with the answers from the supplied object
  loadAnswers(jsonObject) {
    assert(jsonObject.questionnaireId === this.id);
    jsonObject.answers.forEach((answer, index) => {
      let question = this.questions()[index];
      assert(question.id === answer.questionId);
      question.loadAnswer(answer);
    });
    this._last_saved_time = jsonObject._last_saved_time;
    this._last_submitted_time = jsonObject._last_submitted_time;
    this._question_language = jsonObject._question_language;
  }

  translationNamespace() {
    return 'questionnaire-' + this._id;
  }

  // Load all the available translatinons from the supplied json object
  loadTranslations(i18n, languages) {
    Object.keys(languages).forEach(language_code => {
      i18n.addResourceBundle(
        language_code,
        this.translationNamespace(),
        languages[language_code],
        true,
        true,
      );
    });
  }

  toJSON() {
    let jsonObject = super.toJSON();
    // we can't know the display language when the questionnaire is loaded,
    // so don't save it.
    delete jsonObject['_question_language'];
    // _last_saved_time and _last_submitted_time are saved as part of
    // the answers document
    delete jsonObject['_last_saved_time'];
    delete jsonObject['_last_submitted_time'];
    return jsonObject;
  }

  // After loading from JSON, convert references to question by id back to
  // actual objects.
  postJSONLoad() {
    super.postJSONLoad();
    if (this._date_generated) {
      this._date_generated = new Date(this._date_generated);
    }
    if (this._published_date) {
      this._published_date = new Date(this._published_date);
    }
    if (this._submission_deadline) {
      this._submission_deadline = new Date(this._submission_deadline);
    }
    this._questions.forEach(q => q.postJSONLoad(this));
  }
}
