import React, { Component } from 'react';
import './WhoHasAccess.css';

const peopleAccess = [
  {
    id: 1,
    email: 'test@test.com',
    granted: false,
  },
  {
    id: 2,
    email: 'july@test.com',
    granted: true,
  },
  {
    id: 3,
    email: 'test1@test.com',
    granted: false,
  },
  {
    id: 4,
    email: 'kate@test.com',
    granted: true,
  },
];

class WhoHasAccess extends Component {
  state = {
    form: {},
    errors: {},
    people: peopleAccess,
  };

  checkChange = (e, id) => {
    let people = this.state.people.map(item => {
      if (item.id === id) {
        item.granted = e.target.checked;
      }
      return item;
    });
    this.setState({
      people: people,
    });
  };

  submitHandler = e => {
    e.preventDefault();
  };
  switchModal = () => {
    this.props.switchModal('inviteModal', true);
    this.props.switchModal('accessModal', false);
  };

  render() {
    const { people } = this.state;
    return (
      <div className="access-people">
        <form onSubmit={this.submitHandler} className="access-form">
          <div className="access-description">
            <h1 className="access-title">Who has access</h1>
            {people &&
              people.map(person => (
                <div
                  className="form-control-group access-checkbox"
                  key={person.id}
                >
                  <label
                    className="access-label"
                    htmlFor={`access_grant${person.id}`}
                  >
                    {person.email}
                    <span
                      className={`checkmark ${person.granted ? 'active' : ''}`}
                    />
                  </label>
                  <input
                    id={`access_grant${person.id}`}
                    type="checkbox"
                    checked={person.granted}
                    onChange={e => this.checkChange(e, person.id)}
                    className="checkbox"
                  />
                </div>
              ))}
          </div>
          <div className="stop-bottom" id="stop-bottom">
            <button className="access-link" onClick={() => this.switchModal()}>
              Invite people
            </button>
            <div className="btn-block">
              <button className="btn-back hidden" onClick={this.props.onCancel}>
                cancel
              </button>
              <button className="btn-next">done</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default WhoHasAccess;
