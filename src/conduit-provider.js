import React, { Component, Children } from "react";
import PropTypes from "prop-types";
import Registry from "./registry";

class ConduitProvider extends Component {
  constructor(props) {
    super(props);
    const { registry } = this.props;

    this.registry = registry ? registry : new Registry();
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
