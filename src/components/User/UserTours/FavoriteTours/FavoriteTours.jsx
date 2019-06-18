import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { setLoader } from '../../../../actions/loaderActions';
import {
  getFavoriteTours as getFavoriteToursUrl,
  searchPath,
} from '../../../../utils/paths';
import Header from '../../../../components/Header/Header';
//import Pager from '../../../Pager/Pager';
//import Footer from '../../../../components/Footer/Footer';
import SidePanel from '../../../SidePanel/SidePanel';
import navItems from '../../navItems';
import feathersImg from '../../../../assets/img/feathers.png';
import './FavoriteTours.css';
import withAuth from '../../../../services/withAuth/withAuth';
import ApiService from '../../../../services/ApiService/ApiService';
import TourItem from '../../../TourItem/TourItem';
import NotItems from '../../UserDashboard/DashboardPurchased/NotItems/NotItems';
import SearchService from '../../../../services/SearchService/SearchService';
import SidePanelMobile from '../../../SidePanelMobile/SidePanelMobile';
import HeaderMobile from '../../../HeaderMobile/HeaderMobile';

const DESCRIPTION =
  'No favorites here yet! Search and save your next adventures';

const mapStateToProps = state => ({
  auth: state.auth,
  userData: state.auth.userData,
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = {
  setLoader,
};

class FavoriteTours extends Component {
  state = {
    favoriteTours: [],
    activePage: 1,
    itemsPerPage: 9,
    totalItems: 0,
    pageRange: 5,
    pages: null,
    status: '',
  };

  componentDidMount = () => {
    this.getFavoriteTours();
  };
  Api = new ApiService();
  getFavoriteTours = () => {
    this.props.setLoader(true);
    this.Api.getComponent(`${getFavoriteToursUrl}`)
      .then(result => {
        this.props.setLoader(false);
        this.setState({
          favoriteTours: result.data,
          totalItems: result.headers.items_count,
          pages: result.headers.pages,
        });
        if (!result.data.length) {
          this.setNewStatus();
        }
      })
      .catch(e => {
        this.props.setLoader(false);
        this.setNewStatus();
      });
  };

  deleteItemHandler = id => {
    this.setState({ showModal: true });
    let favoriteTours = [...this.state.favoriteTours];
    let filterdFavoriteTours = favoriteTours.filter(tour => tour.id !== id);
    this.setState({ favoriteTours: filterdFavoriteTours });
  };

  setNewStatus = () => {
    this.setState({
      status: "You didn't purchase tours yet",
    });
  };

  // handlePageChange = (e) => {
  //       const itemsSkip = (this.state.itemsPerPage * e) - this.state.itemsPerPage;
  //       this.props.setLoader(true);
  //       this.Api.getComponent(`${getFavoriteTours}?limit=${this.state.itemsPerPage}&offset=${itemsSkip}`)
  //           .then((res) => {
  //               this.setState({
  //                   favoriteTours: res.data,
  //                   activePage: e
  //               })
  //               this.props.setLoader(false);
  //           })
  //           .catch(() => {
  //               this.props.setLoader(false);
  //           })
  // }

  goToMap = () => {
    this.props.history.push(searchPath);
  };

  Search = new SearchService();
  render() {
    return (
      <div className="board-page">
        <div className="board-page-wrap">
          <HeaderMobile />
          <Header />
          <div className="board-page-container">
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
                  <section className="board-section">
                    <div className="favorite-container">
                      {this.state.favoriteTours &&
                      this.state.favoriteTours.length
                        ? this.state.favoriteTours.map(route => (
                            <TourItem
                              key={route.id}
                              route={route}
                              deleteItem={id => this.deleteItemHandler(id)}
                              isModal
                            >
                              <div className="tour-price">
                                {route.cost
                                  ? `$${route.cost.toFixed(2)}`
                                  : 'FREE'}
                              </div>
                            </TourItem>
                          ))
                        : null}
                    </div>
                    {!!this.state.status && (
                      <div
                        className={`${
                          this.state.favoriteTours.length ? 'hidden' : ''
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
                    {/*{ this.state.favoriteTours.length > 0 && +this.state.pages > 1 && <div className="pagination">
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
        </div>

        {/*<Footer />*/}
      </div>
    );
  }
}

export default withAuth(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FavoriteTours)
);
