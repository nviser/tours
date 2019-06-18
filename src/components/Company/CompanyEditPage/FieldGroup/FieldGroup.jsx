import React from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

const handleChange = (e, name, props) => {
  props.editCompany(name, e.target.value);
};

const handleClick = (name, props) => {
  console.log(name, props);
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
    <ControlLabel className="company-settings-label">{label}</ControlLabel>
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
