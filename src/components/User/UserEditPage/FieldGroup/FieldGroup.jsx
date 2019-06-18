import React from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

const handleChange = (e, name, props) => {
  props.editUser(name, e.target.value);
};

const handleClick = (name, props) => {
  switch (name) {
    case 'password':
      props.setChangePassPopup(true);
      break;
    default:
  }
};

const FieldGroup = ({
  id,
  label,
  name,
  title,
  type,
  data,
  disabled,
  placeholder,
}) => (
  <FormGroup controlId={id}>
    <ControlLabel className="user-settings-label">{label}</ControlLabel>
    <div className="input-wrap">
      <FormControl
        value={title || ''}
        onChange={e => {
          handleChange(e, name, data);
        }}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
      />
      <span className="set-edit-button" onClick={() => handleClick(name, data)}>
        Edit
      </span>
    </div>
  </FormGroup>
);

export default FieldGroup;
