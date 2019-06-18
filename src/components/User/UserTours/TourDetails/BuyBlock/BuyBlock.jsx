import React from 'react';
import appStoreImg from '../../../../../assets/img/AppStore.svg';
import { APP_STORE_PATH } from '../../../../../utils/const';
//import googlePlayImg from '../../../../../assets/img/GooglePlay.svg';
import './BuyBlock.css';

const BuyBlock = ({ cost }) => (
  <div className="buy-block">
    <div className="buy-left">{cost > 0 ? `$${cost.toFixed(2)}` : 'FREE'}</div>
    <div className="buy-right">
      <div className="buy-title">
        {cost > 0 ? 'Buy in app' : 'Take tour in app'}
      </div>
      <a href={APP_STORE_PATH}>
        <img src={appStoreImg} className="app-store" alt="app-store" />
      </a>
      {/*<a href="/"><img src={googlePlayImg} alt="google-play"/></a>*/}
    </div>
  </div>
);

export default BuyBlock;
