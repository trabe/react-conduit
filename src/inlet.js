import { Component } from "react";
import PropTypes from "prop-types";
import uuidV4 from "uuid/v4";

export class Inlet extends Component {
  constructor(props) {
    super(props);
    this.id = uuidV4();
  }

  componentDidUpdate(prevProps) {
    if (this.props.label !== prevProps.label) {
      this.context.registry.rewireInlet(this);
    }
    this.context.registry.updateConduits(this);
  }

  UNSAFE_componentWillMount() {
    this.context.registry.registerInlet(this);
  }

  componentWillUnmount() {
    this.context.registry.unregisterInlet(this);
  }

  // Registry Inlet API
  getId = () => this.id;
  getLabel = () => this.props.label;
  getIndex = () => this.props.index;
  getChildren = () => this.props.children;
  onDisconnect = conduit => {
    this.props.onDisconnect(conduit.members());
  };
  onConnect = conduit => {
    this.props.onConnect(conduit.members());
  };

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
  onDisconnect: PropTypes.func,
  onConnect: PropTypes.func,
};

Inlet.defaultProps = {
  index: 0,
  onDisconnect: () => {},
  onConnect: () => {},
};

export default Inlet;
