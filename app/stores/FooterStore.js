import alt from '../alt';
import FooterActions from '../actions/FooterActions';

class FooterStore {
  constructor() {
    this.bindActions(FooterActions);
    this.princesses = [];
  }

  onGetTopPrincessesSuccess(data) {
    this.princesses = data.slice(0, 5);
  }

  onGetTopPrincessesFail(jqXhr) {
    // Handle multiple response formats, fallback to HTTP status code number.
    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
  }
}

export default alt.createStore(FooterStore);
