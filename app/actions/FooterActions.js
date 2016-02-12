import alt from '../alt';

class FooterActions {
  constructor() {
    this.generateActions(
      'getTopPrincessesSuccess',
      'getTopPrincessesFail'
    );
  }

  getTopPrincesses() {
    $.ajax({ url: '/api/princesses/top' })
      .done((data) => {
        this.actions.getTopPrincessesSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getTopPrincessesFail(jqXhr)
      });
  }
}

export default alt.createActions(FooterActions);
