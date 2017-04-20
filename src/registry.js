import createFragment from "react-addons-create-fragment";
import uuidV4 from "uuid";

export const createRegistry = () => ({
  // outletId -> { id: outletId, inlets: [inletIds], watchers: { uuid: fn }}
  outlets: {},
  // inletId -> children
  children: {},
});

const initializeOutlet = (registry, { id, inlets = new Set(), watchers = {} }) => {
  registry.outlets[id] = { id, inlets, watchers };
};

const ensureOutletInitialized = fn =>
  (registry, outletId, ...args) => {
    if (!registry.outlets[outletId]) {
      initializeOutlet(registry, { id: outletId });
    }
    return fn(registry, outletId, ...args);
  };

export const watchOutlet = ensureOutletInitialized((registry, outletId, fn) => {
  const watcherId = uuidV4();
  registry.outlets[outletId].watchers[watcherId] = fn;

  return () => {
    delete registry.outlets[outletId].watchers[watcherId];
  };
});

export const mergeInletChildren = ({ outlets, children }, outletId) =>
  createFragment(
    Array.from((outlets[outletId] && outlets[outletId].inlets) || [])
      .sort((i1, i2) => i1.index - i2.index)
      .map(inlet => [inlet.id, children[inlet.id]])
      .reduce((acc, [id, children]) => ({ ...acc, [id]: children }), {}),
  );

export const addInlet = ensureOutletInitialized((registry, outletId, inlet) => {
  registry.outlets[outletId].inlets.add(inlet);
  notifyWatchers(registry, outletId);
});

export const removeInlet = ensureOutletInitialized((registry, outletId, inletId) => {
  registry.outlets[outletId].inlets.forEach(inlet => {
    if (inlet.id === inletId) {
      registry.outlets[outletId].inlets.delete(inlet);
    }
  });
  notifyWatchers(registry, outletId);
});

export const updateChildren = (registry, inletId, children) => {
  registry.children[inletId] = children;

  Object.values(registry.outlets)
    .filter(outlet => Array.from(outlet.inlets).some(inlet => inlet.id === inletId))
    .forEach(outlet => notifyWatchers(registry, outlet.id));
};

export const notifyWatchers = ensureOutletInitialized(({ outlets }, outletId) => {
  Object.values(outlets[outletId].watchers).forEach(watcher => watcher());
});
