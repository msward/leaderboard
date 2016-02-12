import React from 'react';
import AddPrincessStore from '../stores/AddPrincessStore';
import AddPrincessActions from '../actions/AddPrincessActions';

class AddPrincess extends React.Component {
  constructor(props) {
    super(props);
    this.state = AddPrincessStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    AddPrincessStore.listen(this.onChange);
  }

  componentWillUnmount() {
    AddPrincessStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var name = this.state.name.trim();
    var birthday = this.state.birthday.trim();
    var gender = this.state.gender;

    if (!name) {
      AddPrincessActions.invalidName();
      this.refs.nameTextField.getDOMNode().focus();
    }

    if (!birthday) {
      AddPrincessActions.invalidBirthday();
      this.refs.birthdayTextField.getDOMNode().focus();
    }

    if (!gender) {
      AddPrincessActions.invalidGender();
    }

    if (name && birthday && gender) {
      AddPrincessActions.addPrincess(name, birthday, gender);
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            <div className='panel panel-default'>
              <div className='panel-heading'>Add Princess</div>
              <div className='panel-body'>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <div className={'form-group ' + this.state.nameValidationState}>
                    <label className='control-label'>Princess Name</label>
                    <input type='text' className='form-control' ref='nameTextField' value={this.state.name}
                           onChange={AddPrincessActions.updateName} autoFocus/>
                    <span className='help-block'>{this.state.helpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.birthdayValidationState}>
                    <label className='control-label'>Birthday</label>
                    <input type='text' className='form-control' ref='birthdayTextField' value={this.state.birthday}
                           onChange={AddPrincessActions.updateBirthday} autoFocus/>
                    <span className='help-block'>{this.state.helpBlock}</span>
                  </div>
                  <div className={'form-group ' + this.state.genderValidationState}>
                    <div className='radio radio-inline'>
                      <input type='radio' name='gender' id='female' value='Female' checked={this.state.gender === 'Female'}
                             onChange={AddPrincessActions.updateGender}/>
                      <label htmlFor='female'>Female</label>
                    </div>
                    <div className='radio radio-inline'>
                      <input type='radio' name='gender' id='male' value='Male' checked={this.state.gender === 'Male'}
                             onChange={AddPrincessActions.updateGender}/>
                      <label htmlFor='male'>Male</label>
                    </div>
                  </div>
                  <button type='submit' className='btn btn-primary'>Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPrincess;
