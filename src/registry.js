import createFragment from "react-addons-create-fragment";
import { assoc, dissoc, filter, values } from "ramda";
import Conduit from "./conduit";

class Registry {
  state = {
    outlets: {},
    inlets: {},
    conduits: {},
  };

  // Helper functions

  // find an inlet by id
  findInlet = id => this.state.inlets[id] || null;

  // find all inlets by label
  findInletsByLabel = label => values(this.state.inlets).filter(inlet => inlet.getLabel() === label);

  // add an inlet to the registry state
  // does not check current state
  assocInlet = inlet => {
    this.state.inlets = assoc(inlet.getId(), inlet, this.state.inlets);
  };

  // remove an inlet from the registry state
  // does not check current state
  dissocInlet = inlet => {
    this.state.inlets = dissoc(inlet.getId(), this.state.inlets);
  };

  // add conduits from the inlet to all matching outlets
  wireInlet = inlet =>
    this.findOutletsByLabel(inlet.getLabel()).forEach(outlet => {
      this.registerConduit(new Conduit(inlet, outlet));
      outlet.forceRender();
    });

  // disconnect all conduits from the inlet to all matching outlets.
  // does not remove the inlet.
  unwireInlet = inlet => {
    this.findConduitsByInlet(inlet).forEach(conduit => {
      this.unregisterConduit(conduit);
      conduit.getOutlet().forceRender();
    });
  };

  // find an outlet by id
  findOutlet = id => this.state.outlets[id] || null;

  // find all outlets by label
  findOutletsByLabel = label => values(this.state.outlets).filter(outlet => outlet.getLabel() === label);

  // add an outlet to the registry state
  // does not check current state
  assocOutlet = outlet => {
    this.state.outlets = assoc(outlet.getId(), outlet, this.state.outlets);
  };

  // remove an outlet from the registry state
  // does not check current state
  dissocOutlet = outlet => {
    this.state.outlets = dissoc(outlet.getId(), this.state.outlets);
  };

  // add conduits from the outlet to all matching inlets
  wireOutlet = outlet => {
    this.findInletsByLabel(outlet.getLabel()).forEach(inlet => this.registerConduit(new Conduit(inlet, outlet)));
    outlet.forceRender();
  };

  // disconnect all conduits from the outlet to all matching inlets
  // does not remove the outlet
  unwireOutlet = outlet => {
    this.findConduitsByOutlet(outlet).forEach(this.unregisterConduit);
    outlet.forceRender();
  };

  // add a conduit to the registry state
  // does not check current state
  assocConduit = conduit => {
    this.state.conduits = assoc(conduit.getId(), conduit, this.state.conduits);
  };

  // remove a conduit from the registry state
  // does not check current state
  dissocConduit = conduit => {
    this.state.conduits = dissoc(conduit.getId(), this.state.conduits);
  };

  // register a conduit, invoking the corresponding callbacks and adding the conduit from the registry state
  registerConduit = conduit => {
    this.assocConduit(conduit);
    conduit.connect();
  };

  // unregister a conduit, invoking the corresponding callbacks and removing the conduit from the registry state
  unregisterConduit = conduit => {
    this.dissocConduit(conduit);
    conduit.disconnect();
  };

  // find a conduit by id
  findConduit = id => this.state.conduits[id] || null;

  // find all conduits for a given inlet
  findConduitsByInlet = inlet =>
    values(this.state.conduits).filter(conduit => conduit.getInlet().getId() === inlet.getId());

  // find all conduits for a given outlet
  findConduitsByOutlet = outlet =>
    values(this.state.conduits).filter(conduit => conduit.getOutlet().getId() === outlet.getId());

  //
  // Registry API
  //
  registerInlet = inlet => {
    // Add a new Inlet only if it is not registered
    if (this.findInlet(inlet.getId())) {
      return;
    }

    // Add the inlet to the inlet map and a new Conduit for every outlet with the same label
    this.assocInlet(inlet);
    this.wireInlet(inlet);
  };

  unregisterInlet = inlet => {
    // Do nothing if the Outlet is not registered
    if (!this.findInlet(inlet.getId())) {
      return;
    }

    this.dissocInlet(inlet);
    this.unwireInlet(inlet);
  };

  // full inlet rewire
  // useful when labels change
  rewireInlet = inlet => {
    this.unregisterInlet(inlet);
    this.registerInlet(inlet);
  };

  registerOutlet = outlet => {
    // Do not add a new Outlet if it is already registered
    if (this.findOutlet(outlet.getId())) {
      return;
    }
    // Add the outlet to the outlet map and a new conduit for every inlet with the same label
    this.assocOutlet(outlet);
    this.wireOutlet(outlet);
  };

  unregisterOutlet = outlet => {
    // Do nothing if the Outlet is not registered
    if (!this.findOutlet(outlet.getId())) {
      return;
    }

    this.dissocOutlet(outlet);
    this.unwireOutlet(outlet);
  };

  // full outlet rewire
  // useful when labels change
  rewireOutlet = outlet => {
    this.unregisterOutlet(outlet);
    this.registerOutlet(outlet);
  };

  // force a render for all outlets connected with a given inlet
  updateConduits = inlet => this.findConduitsByInlet(inlet).forEach(conduit => conduit.update());

  // build children using all inlets for the given label
  mergeChildrenForLabel = label =>
    createFragment(
      this.findInletsByLabel(label)
        .sort((i1, i2) => i1.index - i2.index)
        .map(inlet => [inlet.getId(), inlet.getChildren()])
        .reduce((acc, [id, children]) => ({ ...acc, [id]: children }), {}),
    );

  printConduits = () => values(this.state.conduits).forEach(c => console.log(c.toString()));
}

export default Registry;
