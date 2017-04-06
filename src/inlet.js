import React, { Component, Children, PropTypes } from "react";
import uuidV4 from "uuid/v4";
import { updateChildren, removeInlet, addInlet } from "./registry";

export class Inlet extends Component {
  constructor(props) {
    super(props);
    this.id = uuidV4();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.label !== nextProps.label) {
      removeInlet(this.context.registry, this.props.label, this.id);
      addInlet(this.context.registry, nextProps.label, this.id);
    }
    updateChildren(this.context.registry, this.id, nextProps.children);
  }

  componentWillMount() {
    addInlet(this.context.registry, this.props.label, this.id);
    updateChildren(this.context.registry, this.id, this.props.children);
  }

  componentWillUnmount() {
    removeInlet(this.context.registry, this.props.label, this.id);
  }

  render() {
    return null;
  }
}

Inlet.contextTypes = {
  registry: PropTypes.object.isRequired,
};

Inlet.PropTypes = {
  label: PropTypes.string.isRequired,
};

export default Inlet;
