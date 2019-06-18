import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import './TableNoBordered.css';

const setColor = status => {
  switch (status) {
    case 'in_transit':
      return '#FFC06C';
    case 'paid':
      return '#007FA2';
    case 'refund':
      return '#F15B59';
    default:
      return '#525252';
  }
};

const TableNoBorderedPayouts = ({ payouts }) => {
  return (
    <Table responsive hover className="no-bordered-table">
      <thead>
        <tr>
          <th>Payment ID</th>
          <th>Date</th>
          <th>Tours</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {payouts &&
          payouts.map((data, index) => (
            <tr key={index}>
              <td>
                <div className="no-bordered-table-cell">{data.id}</div>
              </td>
              <td>
                <div className="no-bordered-table-cell">
                  {moment.unix(data.date).format('DD/MM/YYYY')}
                </div>
              </td>
              <td>
                <div className="no-bordered-table-cell">{data.tours}</div>
              </td>
              <td>
                <div className="no-bordered-table-cell status">
                  $ {`${data.total.toFixed(3)} ${data.currency}`}
                </div>
              </td>
              <td>
                <div className="no-bordered-table-cell status">
                  <span style={{ color: setColor(data.status) }}>
                    {data && data.status}
                  </span>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};
export default TableNoBorderedPayouts;
