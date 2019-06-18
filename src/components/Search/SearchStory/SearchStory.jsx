import React from 'react';
import GroupSearchForm from '../../../components/Search/GroupSearchForm/GroupSearchForm';
import './SearchStory.css';

const SearchStory = () => (
  <div className="home-page-main-form">
    <h3 className="home-page-main-form-header">
      Find the story and be part of it
    </h3>
    <div className="home-page-search-wrap">
      <GroupSearchForm />
    </div>
  </div>
);
export default SearchStory;
