import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setLoader } from '../../../../actions/loaderActions';
import {
  setMapCenter,
  setUserCurrentLocation,
} from '../../../../actions/mapActions';
import Header from '../../../../components/Header/Header';
import SidePanel from '../../../SidePanel/SidePanel';
import TourBottom from '../../../TourBottom/TourBottom';
//import Pager from '../../../Pager/Pager';
import TourItem from '../../../TourItem/TourItem';
import ApiService from '../../../../services/ApiService/ApiService';
import SearchService from '../../../../services/SearchService/SearchService';
import navItems from '../../navItems';
import './TourPurchased.css';
import withAuth from '../../../../services/withAuth/withAuth';
import { toursPurchasedApiPath, searchPath } from '../../../../utils/paths';
//import Footer from '../../../Footer/Footer'
import feathersImg from '../../../../assets/img/feathers.png';
import NotItems from '../../UserDashboard/DashboardPurchased/NotItems/NotItems';
import SidePanelMobile from '../../../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';

const DESCRIPTION =
  'You haven’t bought any tours yet! The adventure begins here.';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {
  setLoader,
  setMapCenter,
  setUserCurrentLocation,
};

class TourPurchased extends Component {
  state = {
    toursPurchased: [],
    status: '',
    activePage: 1,
    itemsPerPage: 9,
    totalItems: 5,
    pageRange: 5,
    pages: 2,
  };

  componentWillReceiveProps(next) {
    if (next.userData && next.userData.id) this.getRoutes();
  }

  setNewStatus = () => {
    this.setState({
      status: "You didn't purchase tours yet",
    });
  };

  getRoutes = () => {
    if (this.props.userData.id) {
      this.props.setLoader(true);
      this.ApiService.getComponent(toursPurchasedApiPath)
        .then(res => {
          this.props.setLoader(false);
          this.setState({
            toursPurchased: res.data,
            // totalItems: res.headers.items_count,
            // pages: res.headers.pages
          });
          if (!res.data.length) {
            this.setNewStatus();
          }
        })
        .catch(() => {
          this.props.setLoader(false);
          this.setNewStatus();
        });
    }
  };

  goToMap = () => {
    this.props.history.push(searchPath);
  };

  //uncomment after adding pagination at back end
  /*handlePageChange = (e) => {
        const itemsSkip = (this.state.itemsPerPage * e) - this.state.itemsPerPage;
        this.props.setLoader(true);
        this.ApiService.getComponent(`${toursPurchasedApiPath}&limit=${this.state.itemsPerPage}&offset=${itemsSkip}`)
            .then((res) => {
                this.setState({
                    routes: res.data,
                    activePage: e
                })
                this.props.setLoader(false);
            })
            .catch(() => {
                this.props.setLoader(false);
            })
    }*/

  ApiService = new ApiService();
  Search = new SearchService();

  render() {
    return (
      <div className="purch-page">
        <div className="purch-page-wrap">
          <HeaderMobile />
          <Header />
          <div className="purch-page-container">
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
                  <section className="purch-section">
                    <div className="purch-list">
                      {this.state.toursPurchased &&
                        this.state.toursPurchased.map(item => {
                          if (!item.is_free) {
                            return (
                              <TourItem key={item.id} route={item}>
                                <TourBottom route={item} />
                              </TourItem>
                            );
                          }
                          return null;
                        })}
                    </div>
                    {!!this.state.status && (
                      <div
                        className={`${
                          this.state.toursPurchased.length ? 'hidden' : ''
                        } no-data`}
                      >
                        <div className="no-tours-container">
                          <NotItems
                            img={feathersImg}
                            description={DESCRIPTION}
                            clickHandler={this.goToMap}
                            btnTitle="Go to map"
                            clName="dpurchased"
                          />
                        </div>
                      </div>
                    )}
                    {/*{ this.state.toursPurchased.length > 0 && +this.state.pages > 1 && <div className="pagination">
                            <Pager
                                activePage={this.state.activePage}
                                itemsPerPage={this.state.itemsPerPage}
                                totalItems={this.state.totalItems}
                                pageRange={this.state.pageRange}
                                pages={this.state.pages}
                                handlePageChange={(e) => this.handlePageChange(e)}
                            />
                        </div>}*/}
                  </section>
                </Col>
              </Row>
            </Grid>
          </div>
          {/*<Footer />*/}
        </div>
      </div>
    );
  }
}

export default withAuth(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(TourPurchased)
  )
);
