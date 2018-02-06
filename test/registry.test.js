import React from "react";
import { mount, render } from "enzyme";
import { ConduitProvider, Inlet, Outlet, Registry } from "../src";

const mountWithRegister = (element, registry) => mount(element, { context: { registry } });
const mountWithProvider = element =>
  mount(
    <ConduitProvider>
      {element}
    </ConduitProvider>,
  );

describe("registry", () => {
  let registry;

  beforeEach(() => {
    registry = new Registry();
  });

  it("should merge all the children from matching inlets", () => {
    const wrapper = render(
      <ConduitProvider>
        <div>
          <Inlet label="1">
            <div>c1</div>
          </Inlet>
          <Inlet label="1">
            <div>c2</div>
          </Inlet>
          <Inlet label="1" index={-1}>
            <div>c0</div>
          </Inlet>
          <Outlet label="1" />
        </div>
      </ConduitProvider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("should update outlet when inlets change their children", () => {
    const inlet = mountWithRegister(
      <Inlet label="1">
        <p>content</p>
      </Inlet>,
      registry,
    );
    const outlet = mountWithRegister(<Outlet label="1" />, registry);

    expect(outlet.html()).toEqual("<div><p>content</p></div>");
    inlet.setProps({ children: <p>new content</p> });
    expect(outlet.html()).toEqual("<div><p>new content</p></div>");
  });

  it("should update outlets when inlets change their labels", () => {
    const inlet = mountWithRegister(
      <Inlet label="1">
        <p>content</p>
      </Inlet>,
      registry,
    );
    const outlet1 = mountWithRegister(<Outlet label="1" />, registry);
    const outlet2 = mountWithRegister(<Outlet label="2" />, registry);

    expect(outlet1.html()).toEqual("<div><p>content</p></div>");
    expect(outlet2.html()).toEqual("<div></div>");
    inlet.setProps({ label: "2" });
    expect(outlet1.html()).toEqual("<div></div>");
    expect(outlet2.html()).toEqual("<div><p>content</p></div>");
  });

  it("should update outlet when it changes its label", () => {
    const inlet1 = mountWithRegister(
      <Inlet label="1">
        <p>content 1</p>
      </Inlet>,
      registry,
    );
    const inlet2 = mountWithRegister(
      <Inlet label="2">
        <p>content 2</p>
      </Inlet>,
      registry,
    );
    const outlet = mountWithRegister(<Outlet label="1" />, registry);

    expect(outlet.html()).toEqual("<div><p>content 1</p></div>");
    outlet.setProps({ label: "2" });
    expect(outlet.html()).toEqual("<div><p>content 2</p></div>");
  });

  it("should update outlet when a new inlet is rendered", () => {
    const inlet1 = mountWithRegister(
      <Inlet label="1">
        <p>content 1</p>
      </Inlet>,
      registry,
    );
    const outlet = mountWithRegister(<Outlet label="1" />, registry);

    expect(outlet.html()).toEqual("<div><p>content 1</p></div>");
    mountWithRegister(
      <Inlet label="1">
        <p>content 2</p>
      </Inlet>,
      registry,
    );
    expect(outlet.html()).toEqual("<div><p>content 1</p><p>content 2</p></div>");
  });

  it("should update outlet when an inlet is unmounted", () => {
    const inlet1 = mountWithRegister(
      <Inlet label="1">
        <p>content 1</p>
      </Inlet>,
      registry,
    );
    const inlet2 = mountWithRegister(
      <Inlet label="1">
        <p>content 2</p>
      </Inlet>,
      registry,
    );
    const outlet = mountWithRegister(<Outlet label="1" />, registry);

    expect(outlet.html()).toEqual("<div><p>content 1</p><p>content 2</p></div>");
    inlet2.unmount();
    expect(outlet.html()).toEqual("<div><p>content 1</p></div>");
  });

  it("should invoke onDisconnect on both inlet and outlet when a conduit gets disconnected", () => {
    const inletSpy = jest.fn();
    const outletSpy = jest.fn();

    const inlet = mountWithRegister(
      <Inlet label="1" onDisconnect={inletSpy}>
        <p>content</p>
      </Inlet>,
      registry,
    );
    const outlet = mountWithRegister(<Outlet label="1" onDisconnect={outletSpy} />, registry);

    expect(outlet.html()).toEqual("<div><p>content</p></div>");
    inlet.unmount();
    expect(inletSpy).toHaveBeenCalledTimes(1);
    expect(outletSpy).toHaveBeenCalledTimes(1);
  });

  it("should invoke onConnect on both inlet and outlet when a new conduit is connected", () => {
    const inletSpy = jest.fn();
    const outletSpy = jest.fn();

    const inlet = mountWithRegister(
      <Inlet label="1" onConnect={inletSpy}>
        <p>content</p>
      </Inlet>,
      registry,
    );
    const outlet = mountWithRegister(<Outlet label="1" onConnect={outletSpy} />, registry);

    expect(inletSpy).toHaveBeenCalledTimes(1);
    expect(outletSpy).toHaveBeenCalledTimes(1);
  });
});
