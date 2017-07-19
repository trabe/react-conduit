class Conduit {
  constructor(inlet, outlet) {
    this.inlet = inlet;
    this.outlet = outlet;
  }

  disconnect = () => {
    this.inlet.onDisconnect(this);
    this.outlet.onDisconnect(this);
  };

  connect = () => {
    this.inlet.onConnect(this);
    this.outlet.onConnect(this);
  };

  getId = () => `${this.inlet.getId()}-${this.outlet.getId()}`;
  getInlet = () => this.inlet;
  getOutlet = () => this.outlet;
  update = () => this.outlet.forceRender();
  members = () => ({ inlet: this.inlet, outlet: this.outlet });
  toString = () => `${this.getId()}: ${this.inlet.getLabel()} -> ${this.outlet.getLabel()}`;
}

export default Conduit;
