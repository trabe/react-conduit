import React, { Component, Children, PropTypes } from "react";
import { createRegistry } from "./registry";

class ConduitProvider extends Component {
  constructor(props) {
    super(props);
    const { registry } = this.props;

    this.registry = registry ? registry : createRegistry();
  }

  getChildContext() {
    return { registry: this.registry };
  }

  render() {
    return Children.only(this.props.children);
  }
}

ConduitProvider.childContextTypes = {
  registry: PropTypes.object.isRequired,
};

export default ConduitProvider;
