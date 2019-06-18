import React, { Component } from 'react';
import {
  ListGroup,
  ListGroupItem,
  PageHeader,
  Glyphicon,
  FormControl,
  Button,
} from 'react-bootstrap';
import './MapFilter.css';

class MapFilter extends Component {
  state = {
    isOpened: false,
  };
  toggleFilter = () => {
    this.setState({
      isOpened: !this.state.isOpened,
    });
  };

  render() {
    return (
      <div className={`map-filter ${this.state.isOpened ? 'opened' : ''}`}>
        <Button
          className="pull-right menu-toggle-btn"
          onClick={this.toggleFilter}
        >
          <Glyphicon glyph="filter" className="" />
          <br />
          filter
        </Button>
        <ListGroup>
          <ListGroupItem onClick={this.toggleFilter}>
            <PageHeader>
              filter
              <Glyphicon
                glyph="chevron-right"
                className={`pull-right arrow ${
                  this.state.isOpened ? 'rotate' : ''
                }`}
              />
            </PageHeader>
          </ListGroupItem>
          <ListGroupItem>
            <FormControl type="text" placeholder="Ornare Euismod" />
          </ListGroupItem>
          <ListGroupItem>
            <PageHeader>
              showing
              <Glyphicon glyph="chevron-down" className="pull-right arrow" />
            </PageHeader>
            <ListGroup className="inner-list">
              <ListGroupItem>
                <Glyphicon glyph="plus" className="trigger" />
                Buildings
              </ListGroupItem>
              <ListGroupItem>
                <Glyphicon glyph="plus" className="trigger" />
                Companies
              </ListGroupItem>
              <ListGroupItem className="expanded">
                <Glyphicon glyph="minus" className="trigger" />
                Tours
              </ListGroupItem>
            </ListGroup>
          </ListGroupItem>
          <ListGroupItem>
            <PageHeader>
              building year
              <Glyphicon glyph="chevron-down" className="pull-right arrow" />
            </PageHeader>
            <ListGroup className="inner-list">
              <ListGroupItem>
                <Glyphicon glyph="plus" className="trigger" />
                Buildings
              </ListGroupItem>
              <ListGroupItem>
                <Glyphicon glyph="plus" className="trigger" />
                Companies
              </ListGroupItem>
              <ListGroupItem className="expanded">
                <Glyphicon glyph="minus" className="trigger" />
                Tours
              </ListGroupItem>
            </ListGroup>
          </ListGroupItem>
          <ListGroupItem>
            <PageHeader>
              architecture style
              <Glyphicon glyph="chevron-down" className="pull-right arrow" />
            </PageHeader>
            <ListGroup className="inner-list">
              <ListGroupItem>
                <Glyphicon glyph="plus" className="trigger" />
                Buildings
              </ListGroupItem>
              <ListGroupItem>
                <Glyphicon glyph="plus" className="trigger" />
                Companies
              </ListGroupItem>
              <ListGroupItem className="expanded">
                <Glyphicon glyph="minus" className="trigger" />
                Tours
              </ListGroupItem>
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}

export default MapFilter;
