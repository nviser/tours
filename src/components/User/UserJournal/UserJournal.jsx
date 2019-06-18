import './UserJournal.css';
import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withAuth from '../../../services/withAuth/withAuth';
import Header from '../../../components/Header/Header';
import SidePanel from '../../SidePanel/SidePanel';
import UserJournalList from './UserJournalList/UserJournalList';
import navItems from '../../User/navItems';
import SidePanelMobile from '../../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';
const UserJournal = withRouter(props => <UserJournalComponent {...props} />);

class UserJournalComponent extends Component {
  render() {
    return (
      <div className="journal-page">
        <div className="journal-wrap">
          <HeaderMobile />
          <Header />
          <div className="journal-container">
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={3} md={4} sm={4} xs={12}>
                  <SidePanelMobile
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                  <SidePanel
                    items={navItems}
                    register={this.props.userData.role !== 2}
                  />
                </Col>
                <Col lg={9} md={8} sm={8} xs={12}>
                  {this.props.isLoggedIn ? (
                    <section className="journal-section">
                      <div className="journal-content">
                        {/*<div className="add-post-block">*/}
                        {/*<AddJournalPost />*/}
                        {/*</div>*/}
                        <UserJournalList />
                      </div>
                    </section>
                  ) : null}
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  userData: state.auth.userData,
});

export default withAuth(connect(mapStateToProps)(UserJournal));
