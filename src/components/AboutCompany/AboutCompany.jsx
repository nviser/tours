import React, { Component } from 'react';
import moment from 'moment';
import './AboutCompany.css';

class AboutCompany extends Component {
  state = {
    companyData: {},
  };

  componentWillReceiveProps(nextProps) {
    this.setCompanyData(nextProps);
  }

  setCompanyData(props) {
    this.setState({
      companyData: { ...props.companyData },
    });
  }

  render() {
    return (
      <div className="about-company">
        <h3 className="about-company-header">about company</h3>
        <ul>
          <li>
            <div className="company-title">company name</div>
            <div className="company-data">{this.state.companyData.name}</div>
          </li>
          <li>
            <div className="company-title">18 years</div>
            <div className="company-data">
              {moment(this.state.companyData.established_at).format('YYYY')} -{' '}
              {moment(this.state.companyData.closed_at).format('YYYY')}
            </div>
          </li>
          <li>
            <div className="company-title">email</div>
            <div className="company-data">test@test.com</div>
          </li>
          <li>
            <div className="company-title">contact phone</div>
            <div className="company-data">123 321 54546</div>
          </li>
          <li>
            <div className="company-title">website</div>
            <div className="company-data">
              {this.state.companyData.website_url}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default AboutCompany;
