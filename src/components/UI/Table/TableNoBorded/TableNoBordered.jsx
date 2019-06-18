import React from 'react';
import { Table } from 'react-bootstrap';
import StarsRating from '../../StarsRating/StarsRating';
import moment from 'moment';
import './TableNoBordered.css';

const costCalculation = cost => {
  const price = cost * 0.5 - 0.2;
  return `$ ${price.toFixed(2)} USD`;
};

const TableNoBordered = ({ sales }) => {
  return (
    <Table responsive hover className="no-bordered-table">
      <thead>
        <tr>
          <th>Tour Taken</th>
          <th>Date</th>
          <th>Rewiew</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {sales &&
          sales.map((data, index) => (
            <tr key={index}>
              <td>
                <div className="no-bordered-table-cell">
                  {data && data.route && data.route.name}
                </div>
              </td>
              <td>
                <div className="no-bordered-table-cell">
                  {data && moment(data.purchased_at).format('L')}
                </div>
              </td>
              <td>
                <div className="no-bordered-table-cell">
                  {data && data.route_review && data.route_review.rating ? (
                    <StarsRating
                      rating={
                        data && data.route_review && data.route_review.rating
                      }
                    />
                  ) : (
                    'Pending'
                  )}
                </div>
              </td>
              <td>
                <div className="no-bordered-table-cell status">
                  <span>
                    {data &&
                      (data.amount
                        ? `$ ${data.amount} USD`
                        : costCalculation(data.route.cost))}
                  </span>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};
export default TableNoBordered;
