import React, { Component, PropTypes } from "react";
import { watchOutlet, mergeInletChildren } from "./registry";

class Outlet extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { children: this.getChildren() };

    this.getChildren = this.getChildren.bind(this);
    this.updateChildren = this.updateChildren.bind(this);
  }

  componentDidMount() {
    this.removeWatch = watchOutlet(this.context.registry, this.props.label, this.updateChildren);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.label !== nextProps.label) {
      this.updateChildren();
    }
  }

  componentWillUnmount() {
    this.removeWatch && this.removeWatch();
  }

  getChildren() {
    return mergeInletChildren(this.context.registry, this.props.label);
  }

  updateChildren() {
    this.setState({ children: this.getChildren() });
  }

  render() {
    return (
      <div>
        {this.state.children}
      </div>
    );
  }
}

Outlet.contextTypes = {
  registry: PropTypes.object.isRequired,
};

Outlet.PropTypes = {
  label: PropTypes.string.isRequired,
};

export default Outlet;
