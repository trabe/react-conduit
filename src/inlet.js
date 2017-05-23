import React, { Component, Children } from "react";
import PropTypes from "prop-types";
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
      addInlet(this.context.registry, nextProps.label, { id: this.id, index: this.props.index });
    }
    updateChildren(this.context.registry, this.id, nextProps.children);
  }

  componentWillMount() {
    addInlet(this.context.registry, this.props.label, { id: this.id, index: this.props.index });
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

Inlet.propTypes = {
  label: PropTypes.string.isRequired,
  index: PropTypes.number,
};

Inlet.defaultProps = {
  index: 0,
};

export default Inlet;
