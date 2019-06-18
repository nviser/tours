import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import './TableBordered.css';

const TableBordered = ({ payouts }) => {
  return (
    <Table hover responsive className="bordered-table">
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
                <div className="bordered-table-border">{data.id}</div>
              </td>
              <td>
                <div className="bordered-table-border-date">
                  {moment.unix(data.date).format('DD/MM/YYYY')}
                </div>
              </td>
              {/*<td>
                    <div className="bordered-table-border">
                        {data.payment_type}
                    </div>
                    </td>*/}
              <td>
                <div className="bordered-table-border-tours">{data.tours}</div>
              </td>
              <td>
                <div className="bordered-table-border-total">
                  $ {`${data.total.toFixed(3)} ${data.currency}`}
                </div>
              </td>
              <td>
                <div className="bordered-table-no-border status">
                  {data.status}
                </div>
              </td>
            </tr>
          ))}
        {/*<tr>
                <td>
                <div className="bordered-table-border">
                    729232943579
                </div>
                </td>
                <td> 
                <div className="bordered-table-border-date">
                    10/ 05 /2018
                </div>
                </td>
                <td>
                <div className="bordered-table-border">
                    Direct Deposit to laura Thomson via CitiBank Group Inc.
                </div>
                </td>
                <td>
                <div className="bordered-table-border-tours">
                    200
                </div>
                </td>
                <td>
                <div className="bordered-table-border-total">
                $ 10,000.000 USD
                </div>
                </td>
                <td>
                <div className="bordered-table-no-border">
                    Paid
                </div>
                </td>
            </tr>
            <tr>
                <td>
                <div className="bordered-table-border">
                    729232943579
                </div>
                </td>
                <td> 
                <div className="bordered-table-border-date">
                    10/ 05 /2018
                </div>
                </td>
                <td>
                <div className="bordered-table-border">
                    Direct Deposit to laura Thomson via CitiBank Group Inc.
                </div>
                </td>
                <td>
                <div className="bordered-table-border-tours">
                    200
                </div>
                </td>
                <td>
                <div className="bordered-table-border-total">
                $ 10,000.000 USD
                </div>
                </td>
                <td>
                <div className="bordered-table-no-border">
                    Paid
                </div>
                </td>
            </tr>*/}
      </tbody>
    </Table>
  );
};
export default TableBordered;
