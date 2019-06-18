import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Image } from 'react-bootstrap';
import companyImg from '../../../assets/img/company.jpg';

const SearchCompany = props => (
  <Fragment>
    <Col
      lg={6}
      md={6}
      sm={12}
      className="item-block"
      key={props.data._id}
      onClick={() => props.goTo('companies', props.data._id)}
    >
      <Row className="show-grid">
        <Col lg={3} md={3} sm={3} xs={3}>
          <Image className="item-img" rounded responsive src={companyImg} />
        </Col>
        <Col lg={9} md={9} sm={9} xs={9}>
          <h4 className="item-header">{props.data._source.name}</h4>
          {props.data._source.summary}
        </Col>
      </Row>
    </Col>
  </Fragment>
);

SearchCompany.defaultProps = {
  data: null,
};
SearchCompany.propTypes = {
  data: PropTypes.instanceOf(Object),
  goTo: PropTypes.func.isRequired,
};

export default SearchCompany;
