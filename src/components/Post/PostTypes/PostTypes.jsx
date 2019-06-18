import React from 'react';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  setPhotoOption,
  setWorkOption,
  setDocumentOption,
  setPermitDocumentOption,
  setHistoricalDocumentOption,
} from '../../../actions/addPostOptions';
import { setSelectedPostType } from '../../../actions/postActions';
import './PostTypes.css';

const mapDispatchToProps = {
  setPhotoOption,
  setWorkOption,
  setDocumentOption,
  setPermitDocumentOption,
  setHistoricalDocumentOption,
  setSelectedPostType,
};

const mapStateToProps = state => ({
  postTypeSelected: state.postTypeSelected,
});

const PostTypes = props => {
  const setOption = e => {
    props.setSelectedPostType(e.target.value || null);
    switch (e.target.value) {
      case '1':
        props.setPhotoOption(true);
        props.setWorkOption(false);
        props.setDocumentOption(false);
        props.setPermitDocumentOption(false);
        props.setHistoricalDocumentOption(false);
        break;
      case '2':
        props.setPhotoOption(false);
        props.setWorkOption(true);
        props.setDocumentOption(false);
        props.setPermitDocumentOption(false);
        props.setHistoricalDocumentOption(false);
        break;
      case '3':
        props.setPhotoOption(false);
        props.setWorkOption(false);
        props.setDocumentOption(true);
        break;
      default:
    }
  };

  return (
    <ButtonToolbar>
      {props.data.map(item => (
        <Button
          key={item.id}
          value={item.id}
          onClick={setOption}
          className={`post-type-btn ${
            item.id === +props.postTypeSelected ? 'active' : ''
          }`}
        >
          <Glyphicon glyph={item.icon} />
          {item.name}
        </Button>
      ))}
    </ButtonToolbar>
  );
};

PostTypes.defaultProps = {
  postTypeSelected: null,
};
PostTypes.propTypes = {
  setPhotoOption: PropTypes.func.isRequired,
  setWorkOption: PropTypes.func.isRequired,
  setSelectedPostType: PropTypes.func.isRequired,
  setDocumentOption: PropTypes.func.isRequired,
  setPermitDocumentOption: PropTypes.func.isRequired,
  setHistoricalDocumentOption: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  postTypeSelected: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostTypes);
