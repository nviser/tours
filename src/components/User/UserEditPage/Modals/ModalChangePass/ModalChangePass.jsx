import React from 'react';
import {
  Modal,
  Col,
  Row,
  Grid,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import 'react-notifications/lib/notifications.css';
import { connect } from 'react-redux';
import { changePassword } from '../../../../../utils/paths';
import ApiService from '../../../../../services/ApiService/ApiService';
import {
  editUser,
  setChangePassPopup,
  setPass,
  clearChangePassForm,
  setPassFormErrors,
} from '../../../../../actions/editAction';
import './ModalChangePass.css';

const mapDispatchToProps = {
  editUser,
  setChangePassPopup,
  setPass,
  clearChangePassForm,
  setPassFormErrors,
};

const mapStateToProps = state => ({
  userData: state.edit.user,
  passPopupIsShown: state.edit.passPopupIsShown,
  password: state.edit.password,
  errors: state.edit.errors,
});

const Api = new ApiService();

const handleChange = (e, name, props) => {
  props.setPass(name, e.target.value);
};

const createErrElements = (obj, name) => {
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (name === key) {
        return (
          <div key={key} className="password-warn-message warn-color error">
            {obj[key].msg}
          </div>
        );
      }
    }
  }
};

const FieldGroup = ({ id, label, name, title, type, data, ...props }) => (
  <FormGroup controlId={id}>
    <ControlLabel className="pass-label">{label}</ControlLabel>
    <div className="input-wrap">
      <FormControl
        value={title || ''}
        onChange={e => {
          handleChange(e, name, data);
        }}
        {...props}
        type={type}
      />
      {data.errors &&
        data.errors.password &&
        createErrElements(data.errors.password, name)}
    </div>
  </FormGroup>
);

const onHide = props => {
  props.setChangePassPopup(false);
};

const changePass = (e, props) => {
  e.preventDefault();
  Api.sendComponent(props.password, changePassword)
    .then(() => {
      props.clearChangePassForm();
      props.setChangePassPopup(false);
      props.createNotification('success');
    })
    .catch(err => {
      if (err && err.response && err.response.data) {
        props.setPassFormErrors(err.response.data.errors);
        let newErr;
        if (err && err.response && err.response.data.errors) {
          const obj = err.response.data.errors;
          if (typeof obj === 'object') {
            for (const key in obj) {
              newErr = obj[key].msg;
            }
          }
          props.createNotification('error', newErr);
        }
      }
    });
};

const ModalChangePass = props => (
  <Modal
    show={props.passPopupIsShown}
    onHide={() => onHide(props)}
    className="change-pass-popup"
  >
    <form onSubmit={e => changePass(e, props)} name="changePassForm">
      <Modal.Header closeButton>
        <Modal.Title>Change password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid>
          <Row>
            <Col lg={12}>
              <FieldGroup
                id="formControlsText"
                type="password"
                label="password"
                name="old_password"
                placeholder="*************"
                title={props.password.old_password}
                data={props}
              />
            </Col>
            <Col lg={12}>
              <FieldGroup
                id="formControlsText"
                type="password"
                label="new password"
                name="password"
                placeholder="*************"
                title={props.password.password}
                data={props}
              />
            </Col>
            <Col lg={12}>
              <FieldGroup
                id="formControlsText"
                type="password"
                label="confirm password"
                name="re_password"
                placeholder="*************"
                title={props.password.re_password}
                data={props}
              />
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit">SAVE</Button>
      </Modal.Footer>
    </form>
  </Modal>
);

ModalChangePass.defaultProps = {
  password: null,
  passPopupIsShown: null,
};

ModalChangePass.propTypes = {
  password: PropTypes.instanceOf(Object),
  passPopupIsShown: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalChangePass);
