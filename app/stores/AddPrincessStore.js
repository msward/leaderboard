import alt from '../alt';
import AddPrincessActions from '../actions/AddPrincessActions';

class AddPrincessStore {
  constructor() {
    this.bindActions(AddPrincessActions);
    this.name = '';
    this.birthday = '';
    this.gender = '';
    this.helpBlock = '';
    this.nameValidationState = '';
    this.birthdayValidationState = '';
    this.genderValidationState = '';
  }

  onAddPrincessSuccess(successMessage) {
    this.nameValidationState = 'has-success';
    this.helpBlock = successMessage;
  }

  onAddPrincessFail(errorMessage) {
    this.nameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onUpdateName(event) {
    this.name = event.target.value;
    this.nameValidationState = '';
    this.helpBlock = '';
  }

  onUpdateBirthday(event) {
    this.birthday = event.target.value;
    this.birthdayValidationState = '';
    this.helpBlock = '';
  }

  onUpdateGender(event) {
    this.gender = event.target.value;
    this.genderValidationState = '';
  }

  onInvalidName() {
    this.nameValidationState = 'has-error';
    this.helpBlock = 'Please enter a character name.';
  }

  onInvalidBirthday() {
    this.birthdayValidationState = 'has-error';
    this.helpBlock = 'Please enter a birthday.';
  }

  onInvalidGender() {
    this.genderValidationState = 'has-error';
  }
}

export default alt.createStore(AddPrincessStore);

