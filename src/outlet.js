import React, { Component } from "react";
import PropTypes from "prop-types";
import uuidV4 from "uuid";

class Outlet extends Component {
  constructor(props, context) {
    super(props, context);

    this.id = uuidV4();
    this.state = { children: this.getChildren() };
  }

  componentDidUpdate(prevProps) {
    if (this.props.label !== prevProps.label) {
      this.context.registry.rewireOutlet(this);
    }
  }

  componentDidMount() {
    this.context.registry.registerOutlet(this);
  }

  componentWillUnmount() {
    this.context.registry.unregisterOutlet(this);
  }

  getChildren = () => this.context.registry.mergeChildrenForLabel(this.getLabel());

  // Registry Outlet API
  getId = () => this.id;
  getLabel = () => this.props.label;
  onDisconnect = conduit => {
    this.props.onDisconnect(conduit.members());
  };
  onConnect = conduit => {
    this.props.onConnect(conduit.members());
  };
  forceRender = () => this.setState({ children: this.getChildren() });

  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {this.state.children}
      </div>
    );
  }
}

Outlet.contextTypes = {
  registry: PropTypes.object.isRequired,
};

Outlet.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onDisconnect: PropTypes.func,
  onConnect: PropTypes.func,
};

Outlet.defaultProps = {
  className: null,
  style: null,
  onDisconnect: () => {},
  onConnect: () => {},
};

export default Outlet;
