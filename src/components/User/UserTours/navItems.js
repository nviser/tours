import man from '../../../assets/img/merchantDashboard/inactive/man.svg';
import manActive from '../../../assets/img/merchantDashboard/active/man.svg';
import menu from '../../../assets/img/merchantDashboard/inactive/menu.svg';
import menuActive from '../../../assets/img/merchantDashboard/active/menu.svg';
import person from '../../../assets/img/merchantDashboard/inactive/person.svg';
import personActive from '../../../assets/img/merchantDashboard/active/person.svg';
import marker from '../../../assets/img/merchantDashboard/inactive/marker.svg';
import markerActive from '../../../assets/img/merchantDashboard/active/marker.svg';
import clock from '../../../assets/img/merchantDashboard/inactive/clock.svg';
import clockActive from '../../../assets/img/merchantDashboard/active/clock.svg';
import payment from '../../../assets/img/merchantDashboard/inactive/payment.svg';
import paymentActive from '../../../assets/img/merchantDashboard/active/payment.svg';

const navItems = [
  {
    id: 1,
    image: menu,
    imageActive: menuActive,
    title: 'Creator Dashboard',
    classNames: '',
    route: '/creator_dashboard',
  },
  {
    id: 2,
    image: person,
    imageActive: personActive,
    title: 'Merchant Account',
    classNames: '',
    route: '/merchant_account',
  },
  {
    id: 3,
    image: marker,
    imageActive: markerActive,
    title: 'My Tours',
    classNames: '',
    route: '/tours',
  },
  {
    id: 4,
    image: clock,
    imageActive: clockActive,
    title: 'Sales History',
    classNames: '',
    route: '/sales_history',
  },
  {
    id: 5,
    image: payment,
    imageActive: paymentActive,
    title: 'Income History',
    classNames: '',
    route: '/payouts',
  },
  {
    id: 6,
    image: man,
    imageActive: manActive,
    title: 'Merchant Profile',
    classNames: '',
    route: '/agent_profile',
  },
];

const lastItem = {
  id: 6,
  image: man,
  imageActive: manActive,
  title: 'Merchant Profile',
  classNames: '',
  route: '/agent_profile',
};

export { navItems, lastItem };
