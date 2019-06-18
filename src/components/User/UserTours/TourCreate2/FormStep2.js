import React, { Component, Fragment } from 'react';

import AutosuggestComponent from '../../../AutosuggestComponent/AutosuggestComponent';
import Input from '../../../Input';
import Textarea from '../../../Textarea';
import InputErrors from '../../../InputErrors/InputErrors';
import UploadMultimediaPanel from './UploadMultimediaPanel';
import MultimediaPhotosEdit from './MultimediaPhotosEdit';
import PreviewTourStop from './PreviewTourStop';

import './TourStop.css';

class CreateTourFormStep2 extends Component {
  renderTourStop = (data, errorData, onChange) => {
    return (
      <div
        className={`stop-title-block ${
          this.props.suggestedValue ? 'suggest-active' : ''
        }`}
      >
        <h4 className="stop-header">Enter your route stop</h4>
        <Input
          id="title"
          label="Stop Title"
          wrapperClass="stop-title"
          value={data.title}
          onChange={this.onChange}
          labelPosition="top-left"
          // errors={this.state.errors.title}
          placeHolder="Enter title"
        />
        <label htmlFor="" className="modal-sign-in-label">
          Address
        </label>
        <AutosuggestComponent
          id="autosuggest"
          suggestionType="property"
          noReset
          // errors={this.state.errors.address || this.state.errors.location}
          placeholder="Type here to search"
          // getAllData={this.props.getAllData}
          // setMarker={this.setMarker}
          // onSuggestionSelected={this.onSuggestionSelected}
          // propertyValue={this.props.propertyValue}
        />
        {/* <InputErrors
              errors={this.state.errors.address || this.state.errors.location}
            /> */}
      </div>
    );
  };

  render() {
    const { formData, formErrors, onInputChange } = this.props;
    console.log(formData.tourStops);
    if (formData && formData.tourStops && formData.tourStops.length > 0) {
      return formData.tourStops.map((stop, index) => {
        // const errorData = formErrors && formErrors.tourStops ? formErrors.tourStops[index]
        return this.renderTourStop(stop, null, onInputChange);
      });
    } else {
      return null;
    }
  }
}

export default CreateTourFormStep2;
