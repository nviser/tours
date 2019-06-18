import React, { Component } from 'react';
import SliderView from './SliderView/SliderView';
import './UserJournalListItem.css';

export default class UserJournalListItem extends Component {
  render() {
    const {
      title = '',
      content = '',
      attachments = [],
      event_date = '',
    } = this.props;

    return (
      <div className="journal-item">
        <div className="title">{title}</div>
        <div className="date">{new Date(event_date).toDateString()}</div>
        <div className="content">{content}</div>
        {Array.isArray(attachments) && attachments.length > 0 ? (
          <SliderView images={attachments} />
        ) : null}
      </div>
    );
  }
}
