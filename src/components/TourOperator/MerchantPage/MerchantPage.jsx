import React, { Component } from 'react';
import Header from '../../Header/Header';
import { Grid, Row, Col } from 'react-bootstrap';
import ReactImageFallback from 'react-image-fallback';
import { connect } from 'react-redux';
import { API_URL } from '../../../config';
import { setLoader } from '../../../actions/loaderActions';
import { setUserData } from '../../../actions/userActions';
import bcgImg from '../../../assets/img/merchant_profile_bg.png';
import noImg from '../../../assets/img/icons/no-photo.png';
import loader from '../../../assets/img/loading.gif';
import backArrow from '../../../assets/img/merchant/back.png';
import ApiService from '../../../services/ApiService/ApiService';
import { usersPath, routesApiPath } from '../../../utils/paths';
import TourItem from '../../TourItem/TourItem';
import Pager from '../../Pager/Pager';
import inImg from '../../../assets/img/merchant/linkedin.svg';
import fbImg from '../../../assets/img/merchant/facebook.svg';
import twitImg from '../../../assets/img/merchant/twitter.svg';
import { withRouter } from 'react-router-dom';
import HeaderMobile from '../../HeaderMobile/HeaderMobile';
import SocialLink from './SocialLink/SocialLink';
import EmailAddress from './EmailAddress/EmailAddress';
import LocationAddress from './LocationAddress/LocationAddress';
import PhoneNumber from './PhoneNumber/PhoneNumber';
import './MerchantPage.css';
import AuthService from '../../../services/AuthService/AuthService';

const mapStateToProps = state => ({
  agent: state.user,
  address: state.user.primary_address,
  isLoading: state.loader.isLoading,
  company: state.company,
});

const mapDispatchToProps = {
  setLoader,
  setUserData,
};

class MerchantPage extends Component {
  state = {
    agentImg: null,
    agentId: this.props.match.params.id,
    bcgImg: null,
    width: 164,
    bcgWidth: 1280,
    tours: [],
    status: '',
    activePage: 1,
    itemsPerPage: 4,
    totalItems: -1,
    pageRange: 5,
    pages: null,
    address: null,
    company: null,
  };

  componentDidMount() {
    const agentId = this.props.match.params.id;
    if (agentId) {
      this.getUserData(agentId);
    }
  }

  componentWillReceiveProps(next) {
    if (next.match.url !== this.props.match.url)
      this.getUserData(next.match.params.id);
    if (next.address !== this.props.address) this.setAddress(next.address);
  }

  setUserImage = user => {
    if (user.id)
      this.setState({
        agentImg: `${API_URL}/users/${
          user.id
        }/avatar?width=250&avatar_type=merchant-avatar`,
      });
  };

  setBackgroundImage = (user, width) => {
    if (user.id)
      this.setState({
        bcgImg: `${API_URL}/users/${user.id}/background?width=${width}`,
      });
  };

  getUserData = id => {
    this.props.setLoader(true);
    this.Api.getComponent(`${usersPath}/${id}`)
      .then(res => {
        this.props.setUserData(res.data);
        this.setUserImage(res.data, this.state.width);
        this.setBackgroundImage(res.data, this.state.bcgWidth);
        this.getTours(res.data.id);
        if (res.data.staff) {
          this.setState({
            company: res.data.staff.company,
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.props.setLoader(false);
        this.props.history.push(`/agent_${id}_not_available`);
      });
  };

  getTours = id => {
    this.Api.getComponent(
      `${routesApiPath}?user_id=${id}&limit=${
        this.state.itemsPerPage
      }&offset=${0}`
    )
      .then(res => {
        this.setState({
          tours: res.data,
          totalItems: res.headers.items_count,
          pages: res.headers.pages,
        });
        this.props.setLoader(false);
      })
      .catch(err => {
        console.log(err);
        this.props.setLoader(false);
      });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  handlePageChange = e => {
    const itemsSkip = this.state.itemsPerPage * e - this.state.itemsPerPage;
    this.props.setLoader(true);
    this.Api.getComponent(
      `${routesApiPath}?user_id=${this.state.agentId}&limit=${
        this.state.itemsPerPage
      }&offset=${itemsSkip}`
    )
      .then(res => {
        this.setState({
          tours: res.data,
          activePage: e,
        });
        this.props.setLoader(false);
      })
      .catch(() => {
        this.props.setLoader(false);
      });
  };

  setAddress = address => {
    let parsedAddress = '';
    switch (typeof address) {
      case 'string':
        parsedAddress = JSON.parse(address).description;
        break;
      case 'object':
        parsedAddress = address.description;
        break;
      default:
    }
    this.setState({
      address: parsedAddress,
    });
  };

  totalItems = () => {
    const total = this.state.totalItems;
    if (total > 1) {
      return total + ' Tours Posted';
    }
    return total + ' Tour Posted';
  };

  displayAgent = () => {
    return (
      this.props.agent.display_name ||
      (this.props.agent.staff &&
        this.props.agent.staff.company &&
        this.props.agent.staff.company.display_name)
    );
  };

  displaySummary = () => {
    return this.props.agent.staff
      ? this.props.agent.staff.company.summary
      : this.props.agent.summary;
  };

  Api = new ApiService();
  Auth = new AuthService();
  render() {
    const { company } = this.state;
    return (
      <div className="agent-page">
        <HeaderMobile />
        <Header />
        <div className="agent-page-wrap">
          <div className="agent-page-container">
            <div className="agent-top-block">
              <div className="agent-bcg">
                <button className="go-back-btn" onClick={() => this.goBack()}>
                  <img src={backArrow} alt="create-payment-method-back" />
                  Go Back
                </button>
                <ReactImageFallback
                  src={this.state.bcgImg}
                  fallbackImage={bcgImg}
                  alt="user_photo"
                />
              </div>
              <div className="agent-elements">
                <Col lg={3} md={3} sm={3} xs={12}>
                  <div className="agent-avatar">
                    <div className="agent-avatar-img">
                      <ReactImageFallback
                        src={this.state.agentImg}
                        fallbackImage={noImg}
                        initialImage={loader}
                        alt="user_photo"
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={9} md={9} sm={9} xs={12}>
                  <div className="agent-info">
                    <h2 className="agent-header regular-header">
                      {this.displayAgent()}
                    </h2>
                    <p className="agent-descr">
                      {this.state.totalItems < 0 ? '' : this.totalItems()}
                    </p>
                  </div>
                </Col>
              </div>
            </div>
            <Grid componentClass="container-fluid">
              <Row className="show-grid no-margin">
                <Col lg={3} md={3} sm={3} xs={12}>
                  <aside className="agent-aside">
                    {company ? (
                      <ul>
                        {company.linkedin_account && (
                          <SocialLink
                            link={company.linkedin_account}
                            type="linkedin_account"
                            img={inImg}
                          />
                        )}
                        {company.facebook_account && (
                          <SocialLink
                            link={company.facebook_account}
                            type="facebook_account"
                            img={fbImg}
                          />
                        )}
                        {company.twitter_account && (
                          <SocialLink
                            link={company.twitter_account}
                            type="twitter_account"
                            img={twitImg}
                          />
                        )}
                        {company.primary_address && (
                          <LocationAddress address={company.primary_address} />
                        )}
                        {company.business_email && (
                          <EmailAddress email={company.business_email} />
                        )}
                        {company.phone_number && (
                          <PhoneNumber phone={company.phone_number} />
                        )}
                      </ul>
                    ) : (
                      <ul>
                        {this.props.agent.linkedin_account && (
                          <SocialLink
                            link={this.props.agent.linkedin_account}
                            type="linkedin_account"
                            img={inImg}
                          />
                        )}
                        {this.props.agent.facebook_account && (
                          <SocialLink
                            link={this.props.agent.facebook_account}
                            type="facebook_account"
                            img={fbImg}
                          />
                        )}
                        {this.props.agent.twitter_account && (
                          <SocialLink
                            link={this.props.agent.twitter_account}
                            type="twitter_account"
                            img={twitImg}
                          />
                        )}
                        {!!this.props.address && (
                          <LocationAddress address={this.props.address} />
                        )}
                        {this.props.agent.business_email && (
                          <EmailAddress
                            email={this.props.agent.business_email}
                          />
                        )}
                        {this.props.agent.phone_number && (
                          <PhoneNumber phone={this.props.agent.phone_number} />
                        )}
                      </ul>
                    )}
                  </aside>
                </Col>
                <Col lg={9} md={9} sm={9} xs={12}>
                  <div className="agent-summary">
                    <h2 className="agent-block-header regular-header">
                      About {this.displayAgent()}
                    </h2>
                    <div className="summary-text">{this.displaySummary()}</div>
                  </div>
                  {this.state.tours.length > 0 && (
                    <div className="agent-tours">
                      {this.props.agent.first_name && (
                        <h2 className="agent-block-header regular-header">
                          Tours List of {this.displayAgent()}
                        </h2>
                      )}
                      <div className="tours-list">
                        {this.state.tours.length
                          ? this.state.tours.map(route => (
                              <TourItem key={route.id} route={route}>
                                <div className="tour-cost">
                                  {route.cost
                                    ? `$${route.cost.toFixed(2)}`
                                    : 'FREE'}
                                </div>
                              </TourItem>
                            ))
                          : null}
                        {!this.state.tours.length && !this.props.isLoading ? (
                          <p className="search-not-found">
                            {this.state.status}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}
                  {this.state.tours.length > 0 && +this.state.pages > 1 && (
                    <div className="agent-pagination">
                      <Pager
                        activePage={this.state.activePage}
                        itemsPerPage={this.state.itemsPerPage}
                        totalItems={this.state.totalItems}
                        pageRange={this.state.pageRange}
                        pages={this.state.pages}
                        handlePageChange={e => this.handlePageChange(e)}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MerchantPage)
);
