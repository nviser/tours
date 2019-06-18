import React, { Component } from 'react';
import {
  Grid,
  Row,
  Col,
  Panel,
  DropdownButton,
  ButtonToolbar,
  MenuItem,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import './DateFilter.css';

class DateFilter extends Component {
  render() {
    return (
      <Panel className="filter-panel">
        <Panel.Heading>FILTER</Panel.Heading>
        <Panel.Body>
          <Grid>
            <Row className="show-grid">
              <Col lg={2} md={2} sm={2} xs={2} className="picker-title">
                Posted Date:
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                <DatePicker className="picker-start-date" />
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                <DatePicker className="picker-end-date" />
              </Col>
              <Col lg={6} md={6} sm={6} xs={6}>
                <ButtonToolbar>
                  <DropdownButton title="Show: all" id="dropdown-size-medium">
                    <MenuItem eventKey="1">Action</MenuItem>
                    <MenuItem eventKey="2">Another action</MenuItem>
                    <MenuItem eventKey="3">Something else here</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey="4">Separated link</MenuItem>
                  </DropdownButton>
                </ButtonToolbar>
              </Col>
            </Row>
          </Grid>
        </Panel.Body>
      </Panel>
    );
  }
}

export default DateFilter;
