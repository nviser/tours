import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SearchStory from '../../components/Search/SearchStory/SearchStory';
import picture from '../../assets/img/sky.jpg';
import { searchApiPath } from '../../utils/paths';
import { withRouter } from 'react-router-dom';
import './HomePage.css';
import HeaderMobile from '../HeaderMobile/HeaderMobile';

const image = {
  backgroundImage: `url(${picture})`,
  backgroundPosition: `bottom`,
  backgroundSize: `cover`,
};

class HomePage extends Component {
  componentDidMount() {
    this.props.history.push(searchApiPath);
  }
  render() {
    return (
      <div className="home-page-wrap">
        <HeaderMobile />
        <Header hideSearch />
        <section className="home-page-main" style={image}>
          <div className="main-wrap">
            <h1 className="main-title">
              The Stories of buildings <br /> told by their protagonists
            </h1>
            <SearchStory />
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default withRouter(HomePage);
