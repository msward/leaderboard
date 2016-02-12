import alt from '../alt';

class AddPrincessActions {
  constructor() {
    this.generateActions(
      'addPrincessSuccess',
      'addPrincessFail',
      'updateName',
      'updateBirthday',
      'updateGender',
      'invalidName',
      'invalidBirthday',
      'invalidGender'
    );
  }

  addPrincess(name, birthday, gender) {
    $.ajax({
      type: 'POST',
      url: '/api/princess',
      data: { name: name, birthday: birthday, gender: gender }
    })
      .done((data) => {
        this.actions.addPrincessSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.addPrincessFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(AddPrincessActions);

