import React, { Component } from 'react';
import './DashboardJournal.css';
import ApiService from '../../../../services/ApiService/ApiService';
import {
  getJournal as getJournalUrl,
  userJournalPath,
  searchPath,
} from '../../../../utils/paths';
import SearchService from '../../../../services/SearchService/SearchService';
import UserJournalListItem from '../../../UserJournalListItem/UserJournalListItem';
import { connect } from 'react-redux';
import { setLoader } from '../../../../actions/loaderActions';
import { withRouter } from 'react-router-dom';
import NotItems from '../DashboardPurchased/NotItems/NotItems';
import bookImg from '../../../../assets/img/books.png';

const DESCRIPTION =
  'No journal entries here yet. Start traveling and save your memories.';

class DashboardJournal extends Component {
  state = {
    journals: [],
  };
  componentDidMount = () => {
    this.getJournalHandler();
  };
  Api = new ApiService();
  Search = new SearchService();

  getJournalHandler = () => {
    this.props.setLoader(true);
    this.Api.getJournal(`${getJournalUrl}?limit=2&offset=0`)
      .then(result => {
        this.setState({ journals: result.data });
        this.props.setLoader(false);
      })
      .catch(e => {
        this.props.setLoader(false);
      });
  };

  goTo = path => {
    this.props.history.push(path);
  };

  render() {
    return (
      <div className="journal-board">
        <div className="journal-board-header">
          <span>My Journal</span>
          {this.state.journals.length > 1 && (
            <a
              className="journal-view-more"
              onClick={() => this.goTo(userJournalPath)}
            >
              View More
            </a>
          )}
        </div>
        {this.state.journals.length > 0 && (
          <UserJournalListItem
            key={this.state.journals[1].id}
            {...this.state.journals[1]}
          />
        )}

        {!this.state.journals.length && !this.props.isLoading && (
          <NotItems
            img={bookImg}
            description={DESCRIPTION}
            clickHandler={() => this.goTo(searchPath)}
            btnTitle="Go to map"
            clName="djournal"
          />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoader: status => dispatch(setLoader(status)),
  };
};
const mapStateToProps = state => {
  return {
    isLoading: state.loader.isLoading,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardJournal)
);
