import React, { Component } from 'react';
import Textarea from '../../Textarea';
import Input from '../../Input';
import { validate } from '../../../utils/validator';
import './InvitePeople.css';

class InvitePeople extends Component {
  state = {
    form: {},
    errors: {},
  };

  onChange = (value, name) => {
    this.setState(prevSate => ({
      form: {
        ...prevSate.form,
        [name]: value,
      },
    }));
  };

  validate = () => {
    const mail = { type: 'email', message: 'Wrong email' };
    const valid = validate(mail, this.state.form.email);
    if (valid) {
      this.setState(prevSate => ({
        errors: {
          ...prevSate.errors,
          email: mail.message,
        },
      }));
    }
    return valid;
  };

  submitHandler = e => {
    e.preventDefault();

    // if (this.validate()) return;
    // this.submitHandler(e, this.state.form);
  };

  switchModal = () => {
    this.props.switchModal('inviteModal', false);
    this.props.switchModal('accessModal', true);
  };

  render() {
    const { form, errors } = this.state;
    return (
      <div className="invite-people">
        <form onSubmit={this.submitHandler}>
          <h1 className="invite-people-title">Invite people</h1>
          <div className="invite-people-description">
            <Input
              id="email"
              label="Insert e-mail address"
              className="form-control-input"
              wrapperClass="form-control-group"
              placeHolder="Insert e-mail address"
              value={form.email}
              type="email"
              onChange={this.onChange}
              errors={errors.email}
            />
            <Textarea
              id="message"
              label="Message"
              className="form-control-textarea"
              wrapperClass="form-control-group"
              placeholder="Insert message..."
              value={form.message}
              type="text"
              onChange={this.onChange}
            />
          </div>
          <div className="stop-bottom" id="stop-bottom">
            <button className="access-link" onClick={() => this.switchModal()}>
              Who has access
            </button>
            <div className="btn-block">
              <button className="btn-back" onClick={this.props.onCancel}>
                cancel
              </button>
              <button className="btn-next">send</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default InvitePeople;
