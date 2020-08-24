import React, { Component } from "react"
import ReactDOM from 'react-dom';
"use strict";

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    return (<h1>shhdshdh</h1>)
  }
}

const domContainer = document.querySelector("#react-sample");
ReactDOM.render(<LikeButton />, domContainer);
