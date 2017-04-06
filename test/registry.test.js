import React from "react";
import Chai from "chai";
import * as r from "../src/registry";

const expect = Chai.expect;

describe("registry", () => {
  let registry;

  beforeEach(() => {
    registry = r.createRegistry();
  });

  describe("createRegistry", () => {
    it("creates an empty registry", () => {
      expect(registry).to.deep.equal({ outlets: {}, children: {} });
    });
  });

  describe("watchOutlet", () => {
    it("initializes the outlet if it doesn't exist", () => {
      r.watchOutlet(registry, "1", () => {});
      expect(registry.outlets).to.include.keys("1");
    });

    it("adds the function to the watcher list", () => {
      const fn = () => {};
      r.watchOutlet(registry, "1", fn);
      expect(Object.values(registry.outlets["1"].watchers)).to.include(fn);
    });

    it("returns a function that unregisters the watcher", () => {
      const fn = () => {};
      const unregister = r.watchOutlet(registry, "1", fn);
      unregister();
      expect(Object.values(registry.outlets["1"].watchers)).not.to.include(fn);
    });
  });

  describe("addInlet", () => {
    it("adds the inletId to the outlet's inlet set", () => {
      r.addInlet(registry, "outlet1", "inlet1");
      expect(Array.from(registry.outlets["outlet1"].inlets)).to.include("inlet1");
    });

    it("notifies the outlet's watcher list", done => {
      const fn = () => {
        done();
      };
      r.watchOutlet(registry, "outlet1", fn);
      r.addInlet(registry, "outlet1", "inlet1");
    });

    it("does nothing if the inlet already exists", () => {
      r.addInlet(registry, "outlet1", "inlet1");
      r.addInlet(registry, "outlet1", "inlet1");
      expect(Array.from(registry.outlets["outlet1"].inlets)).to.include("inlet1");
    });
  });

  describe("removeInlet", () => {
    it("removes the inletId from the outlet's inlet set", () => {
      r.addInlet(registry, "outlet1", "inlet1");
      r.removeInlet(registry, "outlet1", "inlet1");
      expect(Array.from(registry.outlets["outlet1"].inlets)).not.to.include("inlet1");
    });

    it("notifies the outlet's watcher list", done => {
      const fn = () => {
        done();
      };
      r.addInlet(registry, "outlet1", "inlet1");
      r.watchOutlet(registry, "outlet1", fn);
      r.removeInlet(registry, "outlet1", "inlet1");
    });

    it("does nothing if the inlet does not exist", () => {
      r.removeInlet(registry, "outlet1", "inlet1");
      expect(Array.from(registry.outlets["outlet1"].inlets)).not.to.include("inlet1");
    });
  });

  describe("mergeInletChildren", () => {
    const children1 = <div>children</div>;
    const children2 = <div>children</div>;
    const children3 = <div>children</div>;

    it("merged children keys are unique", () => {
      r.updateChildren(registry, "inlet1", children1);
      r.updateChildren(registry, "inlet2", children2);
      r.updateChildren(registry, "inlet3", children3);
      r.addInlet(registry, "outlet1", "inlet1");
      r.addInlet(registry, "outlet1", "inlet2");
      r.addInlet(registry, "outlet1", "inlet3");
      const children = r.mergeInletChildren(registry, "outlet1");
      expect(Array.from(new Set(children.map(element => element.key))).length).to.equal(children.length);
    });
  });

  describe("updateChildren", () => {
    const children = <div>children</div>;

    it("sets the children for the inlet", () => {
      r.updateChildren(registry, "inlet1", children);
      expect(registry.children["inlet1"]).to.equal(children);
    });

    it("notifies only the outlet watchers where the inlet is included", done => {
      const fn1 = () => done();
      const fn2 = () => done(new Error("Should not invoke other outlets watchers"));
      const fn3 = () => done(new Error("Should not invoke other outlets watchers"));

      r.addInlet(registry, "outlet1", "inlet1");
      r.watchOutlet(registry, "outlet1", fn1);
      r.watchOutlet(registry, "outlet2", fn2);
      r.watchOutlet(registry, "outlet3", fn3);
      r.updateChildren(registry, "inlet1", children);
    });
  });

  describe("notifyWatchers", () => {
    it("notifies watchers", done => {
      const fn = () => {
        done();
      };
      r.watchOutlet(registry, "outlet1", fn);
      r.notifyWatchers(registry, "outlet1");
    });

    it("does nothing if nobody is watching", () => {
      r.notifyWatchers(registry, "outlet1");
    });
  });
});
