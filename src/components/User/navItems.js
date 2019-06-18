import menu from '../../assets/img/userDashboard/inactive/menu.svg';
import menuActive from '../../assets/img/userDashboard/active/menu.svg';
import account from '../../assets/img/userDashboard/inactive/account.svg';
import accountActive from '../../assets/img/userDashboard/active/account.svg';
import heart from '../../assets/img/userDashboard/inactive/heart.svg';
import heartActive from '../../assets/img/userDashboard/active/heart.svg';
import tour from '../../assets/img/userDashboard/inactive/purshasedTour.svg';
import tourActive from '../../assets/img/userDashboard/active/purshasedTour.svg';
import journal from '../../assets/img/userDashboard/inactive/journal.svg';
import journalActive from '../../assets/img/userDashboard/active/journal.svg';
import payment from '../../assets/img/userDashboard/inactive/payment.svg';
import paymentActive from '../../assets/img/userDashboard/active/payment.svg';
import { toursPurchasedPath, favoriteTours } from '../../utils/paths';

const navItems = [
  {
    id: 1,
    image: menu,
    imageActive: menuActive,
    title: 'My Dashboard',
    classNames: '',
    route: '/dashboard',
  },
  {
    id: 2,
    image: heart,
    imageActive: heartActive,
    title: 'Favorite Tours',
    classNames: '',
    route: favoriteTours,
  },
  {
    id: 3,
    image: tour,
    imageActive: tourActive,
    title: 'Tours Purchased',
    classNames: '',
    route: toursPurchasedPath,
  },
  {
    id: 4,
    image: journal,
    imageActive: journalActive,
    title: 'My Journal',
    classNames: '',
    route: '/user-journal',
  },
  {
    id: 5,
    image: payment,
    imageActive: paymentActive,
    title: 'Payment Methods',
    classNames: '',
    route: '/payment_methods',
  },
  {
    id: 6,
    image: account,
    imageActive: accountActive,
    title: 'My Account',
    classNames: '',
    route: '/edit_user_account',
  },
  // {
  //     id: 7,
  //     image: payment,
  //     imageActive: paymentActive,
  //     title: 'Create payment method',
  //     classNames: '',
  //     route: '/create_payment_method'
  // }
];

export default navItems;
