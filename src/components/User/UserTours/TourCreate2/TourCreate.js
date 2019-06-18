import React, { Component, Fragment } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import Input from '../../../Input';

import HeaderMobile from '../../../HeaderMobile/HeaderMobile';
import Header from '../../../../components/Header/Header';
import TourSteps from '../TourSteps/TourSteps';
import BottomNavigationPanel from '../BottomNavigationPanel/BottomNavigationPanel';
import MapPanel from '../../../MapPanel/MapPanel';
import Modal from '../../../UI/Modal/Modal';
import UploadPhoto from './UploadPhoto/UploadPhoto';
import Textarea from '../../../Textarea';
import { CustomSelect } from '../../../CustomSelect/CustomSelect';

import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';

import './TourCreate.css';

class TourCreate extends Component {
  state = {
    showModal: false,
  };

  validateForm = () => {
    return true;
  };

  goNextStep = () => {};

  renderStepForm = () => {
    const {
      formData,
      formErrors,
      formAttachments,
      onInputChange,
      onUploadClick,
      onLoadBlob,
      step,
    } = this.props;

    switch (step) {
      case 1:
        return (
          <Fragment>
            <TourSteps stepActive="1" />
            <FormStep1
              formData={formData}
              formErrors={formErrors}
              formAttachments={formAttachments}
              onInputChange={onInputChange}
              onUploadClick={onUploadClick}
              onLoadBlob={onLoadBlob}
            />
          </Fragment>
        );

      case 2:
        return (
          <Fragment>
            <TourSteps stepActive="2" />
            <FormStep2
              formData={formData}
              formErrors={formErrors}
              formAttachments={formAttachments}
              onInputChange={onInputChange}
            />
          </Fragment>
        );

      case 3:
        return (
          <Fragment>
            <TourSteps stepActive="3" />
            {/* <FormStep2
              formData={formData}
              formErrors={formErrors}
              onInputChange={onInputChange}
            /> */}
          </Fragment>
        );

      default:
        return null;
    }
  };

  render() {
    const { onStepChangeClick, step } = this.props;

    return (
      <div className="create-tour-page">
        <div className="create-tour-wrap">
          <HeaderMobile />
          <Header hideSearch />
          <div className="create-tour-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid">
                <Col lg={6} md={6} sm={12} className="left-block">
                  <div className="left-panel">
                    <div className="create-tour-main-block">
                      {this.renderStepForm()}
                    </div>
                  </div>
                  <BottomNavigationPanel
                    infoString="You earn $4.82 each time this tour is purchased"
                    backHandler={() => onStepChangeClick('back')}
                    path={'/tours'}
                    nextHandler={() => onStepChangeClick('next')}
                    disabled={!this.validateForm()}
                    btnName="next"
                    btnCancelTitle={step === 1 ? 'Cancel' : 'Back'}
                  />
                </Col>
                <Col lg={6} md={6} sm={12} className="rigth-panel">
                  <section className="create-or-edit-tour-section">
                    <MapPanel />
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default TourCreate;
