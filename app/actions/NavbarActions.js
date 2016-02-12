import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getPrincessesCountSuccess',
      'getPrincessesCountFail',
      'findPrincessesSuccess',
      'findPrincessesFail'
    );
  }

  findPrincess(payload) {
    $.ajax({
      url: '/api/princesses/search',
      data: { name: payload.searchQuery }
    })
      .done((data) => {
        assign(payload, data);
        this.actions.findPrincessSuccess(payload);
      })
      .fail(() => {
        this.actions.findPrincessFail(payload);
      });
  }

  getPrincessCount() {
    $.ajax({ url: '/api/princesses/count' })
      .done((data) => {
        this.actions.getPrincessCountSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.getPrincessCountFail(jqXhr)
      });
  }
}

export default alt.createActions(NavbarActions);

