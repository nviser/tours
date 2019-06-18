import React, { Component } from 'react';

import frame_0 from './img/frame-0.png';
import frame_1 from './img/frame-1.png';
import frame_2 from './img/frame-2.png';
import frame_3 from './img/frame-3.png';
import frame_4 from './img/frame-4.png';
import frame_5 from './img/frame-5.png';
import frame_6 from './img/frame-6.png';
import frame_7 from './img/frame-7.png';
import frame_8 from './img/frame-8.png';
import frame_9 from './img/frame-9.png';
import frame_10 from './img/frame-10.png';
import frame_11 from './img/frame-11.png';
import frame_12 from './img/frame-12.png';
import frame_13 from './img/frame-13.png';
import frame_14 from './img/frame-14.png';
import frame_15 from './img/frame-15.png';
import frame_16 from './img/frame-16.png';
import frame_17 from './img/frame-17.png';
import frame_18 from './img/frame-18.png';
import frame_19 from './img/frame-19.png';
import frame_20 from './img/frame-20.png';
import frame_21 from './img/frame-21.png';
import frame_22 from './img/frame-22.png';
import frame_23 from './img/frame-23.png';
import frame_24 from './img/frame-24.png';
import frame_25 from './img/frame-25.png';
import frame_26 from './img/frame-26.png';
import frame_27 from './img/frame-27.png';
import frame_28 from './img/frame-28.png';
import frame_29 from './img/frame-29.png';

export default class LoadAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: 0,
      frames: [
        frame_0,
        frame_1,
        frame_2,
        frame_3,
        frame_4,
        frame_5,
        frame_6,
        frame_7,
        frame_8,
        frame_9,
        frame_10,
        frame_11,
        frame_12,
        frame_13,
        frame_14,
        frame_15,
        frame_16,
        frame_17,
        frame_18,
        frame_19,
        frame_20,
        frame_21,
        frame_22,
        frame_23,
        frame_24,
        frame_25,
        frame_26,
        frame_27,
        frame_28,
        frame_29,
      ],
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.setState((prevState, props) => ({
        img: prevState.img < 28 ? prevState.img + 1 : 0,
      }));
    }, 50);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div className="text-center">
        <img src={this.state.frames[this.state.img]} alt="load" />
      </div>
    );
  }
}
