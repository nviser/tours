import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getList, getMoreList } from '../../../../actions/userJournalList';
import UserJournalListItem from '../../../UserJournalListItem/UserJournalListItem';
import LoadAnimation from './LoadAnimation/LoadAnimation';
import NotItems from '../../UserDashboard/DashboardPurchased/NotItems/NotItems';
import bookImg from '../../../../assets/img/books.png';
import { searchPath } from '../../../../utils/paths';

const DESCRIPTION =
  'No journal entries here yet. Start traveling and save your memories.';
const mapStateToProps = state => ({
  journalList: state.userJournalList.journalList,
  isLoadingJournalList: state.userJournalList.isLoadingJournalList,
  isCompleteJournalList: state.userJournalList.isCompleteJournalList,
  history: state.history,
});

const mapDispatchToProps = {
  getList,
  getMoreList,
};

const UserJournalList = withRouter(props => (
  <UserJournalListComponent {...props} />
));

class UserJournalListComponent extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
    this.props.getList(0, 10);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll() {
    const {
      journalList,
      isCompleteJournalList,
      isLoadingJournalList,
    } = this.props;

    if (isCompleteJournalList) return;

    if (!isLoadingJournalList && !isCompleteJournalList) {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        this.props.getMoreList(journalList.length);
      }
    }
  }

  render() {
    return (
      <div>
        {!this.props.journalList.length && (
          <NotItems
            img={bookImg}
            description={DESCRIPTION}
            clickHandler={() => {
              this.props.history.push(searchPath);
            }}
            btnTitle="Go to map"
            clName="djournal"
          />
        )}
        {this.props.journalList.map(item => {
          return <UserJournalListItem key={item.id} {...item} />;
        })}
        {this.props.isLoadingJournalList ? <LoadAnimation /> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserJournalList);
