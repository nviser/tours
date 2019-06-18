import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Image } from 'react-bootstrap';
import userImg from '../../../assets/img/user.jpg';

const SearchUser = props => (
  <Fragment>
    <Col
      lg={6}
      md={6}
      sm={12}
      className="item-block"
      key={props.data._id}
      onClick={() => props.goTo('users', props.data._id)}
    >
      <Row className="show-grid">
        <Col lg={3} md={3} sm={3} xs={3}>
          <Image className="item-img" rounded responsive src={userImg} />
        </Col>
        <Col lg={9} md={9} sm={9} xs={9}>
          <h4 className="item-header">
            {props.data._source.first_name} {props.data._source.last_name}
          </h4>
          {props.data._source.summary}
        </Col>
      </Row>
    </Col>
  </Fragment>
);

SearchUser.defaultProps = {
  data: null,
};
SearchUser.propTypes = {
  data: PropTypes.instanceOf(Object),
  goTo: PropTypes.func.isRequired,
};

export default SearchUser;
