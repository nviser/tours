import React from 'react';
import Pagination from 'react-js-pagination';
import dbLeftArrow from '../../assets/img/pager/angle-double.svg';
import leftArrow from '../../assets/img/pager/angle.svg';

const Pager = ({
  activePage,
  itemsPerPage,
  totalItems,
  pageRange,
  handlePageChange,
}) => (
  <Pagination
    prevPageText={<img src={dbLeftArrow} alt="Prev" />}
    nextPageText={<img src={dbLeftArrow} alt="Next" className="right" />}
    firstPageText={<img src={leftArrow} alt="First" />}
    lastPageText={<img src={leftArrow} alt="Last" className="right" />}
    activePage={activePage}
    itemsCountPerPage={itemsPerPage}
    totalItemsCount={totalItems}
    pageRangeDisplayed={pageRange}
    onChange={e => handlePageChange(e)}
  />
);

export default Pager;
