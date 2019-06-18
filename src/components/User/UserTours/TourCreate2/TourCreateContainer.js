import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import ApiService from '../../../../services/ApiService/ApiService';
import {
  getFilters,
  routesApiPath,
  tourStopListPath,
  routesPath,
} from '../../../../utils/paths';
import Modal from '../../../UI/Modal/Modal';
import UploadPhoto from './UploadPhoto/UploadPhoto';

import TourCreate from './TourCreate';

const API = new ApiService();

function handleGetFilters(url, context) {
  return new Promise((resolve, reject) => {
    API.getComponent(url)
      .then(res => {
        const { age, categories, mobility } = res.data;
        resolve({
          filters: res.data,
          ageItems: age.map(item => ({
            id: item.id,
            name: item.name,
          })),
          categoryItems: categories.map(item => ({
            id: item.id,
            name: item.name,
          })),
          mobilityItems: mobility.map(item => ({
            id: item.id,
            name: item.name,
          })),
        });
      })
      .catch(e => reject(e));
  });
}

class TourCreateContainer extends Component {
  state = {
    uploadModalVisible: false,
    step: 1,
    formData: {
      tourTitle: '',
      mobility: null,
      age: null,
      category: null,
      tourDescription: '',
      mobilityItems: [],
      ageItems: [],
      categoryItems: [],
      tourStops: [
        {
          key: 1,
          title: '',
          address: '',
          description: '',
          attachmentsId: null,
        },
      ],
    },
    formErrors: {
      tourTitle: '',
    },
    formAttachments: {
      tourPhoto: null,
    },
  };

  componentDidMount() {
    const draftData = localStorage.getItem('tourCreateDraftData');
    // console.log(JSON.parse(draftData));
    if (draftData) {
      this.setState(JSON.parse(draftData));
    }
    // this.props.setLoader(true);
    this.loadFiltersData();
  }

  updateConnectedState = newState => {
    return new Promise(resolve => {
      this.setState(newState, () => {
        const { step, formData, formErrors } = this.state;
        localStorage.setItem(
          'tourCreateDraftData',
          JSON.stringify({
            step,
            formData,
            formErrors,
          })
        );
        resolve();
      });
    });
  };

  loadFiltersData = async () => {
    const data = await handleGetFilters(getFilters);
    const { mobilityItems, categoryItems, ageItems } = data;

    this.setState({
      formData: {
        ...this.state.formData,
        mobilityItems,
        categoryItems,
        ageItems,
      },
    });
  };

  handleInputChange = async (value, id) => {
    await this.updateConnectedState({
      formData: {
        ...this.state.formData,
        [id]: value,
      },
    });
  };

  handleChangeStep = async (whereToGo = 'next') => {
    if (whereToGo === 'next') {
      await this.updateConnectedState({ step: this.state.step + 1 });
    } else {
      const nextStep = this.state.step - 1;
      if (nextStep < 1) {
        this.props.history.push('/tours');
      } else {
        await this.updateConnectedState({ step: nextStep });
      }
    }
  };

  handleUploadClick = () => this.setState({ uploadModalVisible: true });

  handleUploadModalClose = () => this.setState({ uploadModalVisible: false });

  handleTourPhotoSelect = file => {
    this.setState({
      formAttachments: {
        ...this.state.formAttachments,
        tourPhoto: file,
      },
    });
  };

  render() {
    const {
      step,
      uploadModalVisible,
      formData,
      formErrors,
      formAttachments,
    } = this.state;
    console.log(this.state, this.props, formAttachments);
    return (
      <Fragment>
        <TourCreate
          step={step}
          onStepChangeClick={this.handleChangeStep}
          formData={formData}
          formErrors={formErrors}
          formAttachments={formAttachments}
          onInputChange={this.handleInputChange}
          onUploadClick={this.handleUploadClick}
          onLoadBlob={this.loadBlob}
        />
        <Modal show={uploadModalVisible}>
          <UploadPhoto
            modalClosed={this.handleUploadModalClose}
            onSelect={this.handleTourPhotoSelect}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(TourCreateContainer);
// export default TourCreateContainer;
