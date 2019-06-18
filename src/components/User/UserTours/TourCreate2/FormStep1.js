import React, { Component, Fragment } from 'react';
import ReactImageFallback from 'react-image-fallback';

import Input from '../../../Input';
import Textarea from '../../../Textarea';
import { CustomSelect } from '../../../CustomSelect/CustomSelect';
import noImg from '../../../../assets/img/icons/no-photo.png';
import './TourCreate.css';

class CreateTourFormStep1 extends Component {
  getBlobUrl = async blobLocalUrl => {
    return await this.props.onLoadBlob(blobLocalUrl);
  };

  renderAttachments = tourPhoto => {
    if (tourPhoto && tourPhoto.preview) {
      return (
        <ReactImageFallback
          src={tourPhoto.preview}
          fallbackImage={noImg}
          alt="tour background"
        />
      );
    } else {
      return (
        <div>
          <div className="upload-multimedia-image">
            <i className="fa fa-camera" />
            Upload Photo
          </div>
        </div>
      );
    }
  };

  render() {
    const {
      onInputChange,
      onUploadClick,
      formData,
      formErrors,
      formAttachments,
    } = this.props;
    const { tourPhoto } = formAttachments;

    return (
      <Fragment>
        <div className="tour-title-block">
          <Input
            id="tourTitle"
            label="Tour Title"
            className="tour-title-input email"
            wrapperClass="form-control-group"
            placeHolder="Insert Tour Title"
            value={formData.tourTitle}
            type="text"
            onChange={onInputChange}
            errors={formErrors.tourTitle}
          />
        </div>
        <div className="tour-select-block">
          <CustomSelect
            onChange={onInputChange}
            placeholder="Select Age"
            selected={formData.age}
            options={formData.ageItems}
            name="age"
            mode="multiple"
            fieldToShow="name"
            fieldToSend="id"
            label="Age Range"
          />
          <CustomSelect
            onChange={onInputChange}
            placeholder="Select Mode"
            selected={formData.mobility}
            options={formData.mobilityItems}
            name="mobility"
            mode="single"
            fieldToShow="name"
            fieldToSend="id"
            label="Travel Mode"
          />
          <CustomSelect
            onChange={onInputChange}
            placeholder="Select Category"
            selected={formData.category}
            options={formData.categoryItems}
            name="category"
            mode="single"
            fieldToShow="name"
            fieldToSend="id"
            label="Category"
          />
        </div>
        <div className="tour-description">
          <Textarea
            id="tourDescription"
            label="Description of Tour"
            value={formData.tourDescription}
            wrapperClass="tour-descr"
            onChange={onInputChange}
            labelPosition="top-left"
            placeholder="Type your description"
          />
          <div className="symbol-count">
            {formData.tourDescription ? formData.tourDescription.length : 0}{' '}
            /300
          </div>
        </div>
        <div className="upload-video" onClick={onUploadClick}>
          {this.renderAttachments(tourPhoto)}
        </div>
      </Fragment>
    );
  }
}

export default CreateTourFormStep1;
