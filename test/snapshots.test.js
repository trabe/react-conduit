import React from "react";
import { render } from "enzyme";
import { ConduitProvider, Inlet, Outlet } from "../src";

const renderWithProvider = element =>
  render(
    <ConduitProvider>
      {element}
    </ConduitProvider>,
  );

describe("conduit snapshots", () => {
  describe("Inlet", () => {
    it("Inlet should not render its children", () => {
      const wrapper = renderWithProvider(
        <Inlet label="outlet1">
          <div>this shouldn't be seen</div>
        </Inlet>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("Outlet", () => {
    it("Outlet should not render its children", () => {
      const wrapper = renderWithProvider(
        <Outlet label="outlet1">
          <div>this shouldn't be seen</div>
        </Outlet>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("Inlet and Outlet", () => {
    it("should output Inlet's children to the corresponding outlet", () => {
      const wrapper = renderWithProvider(
        <div>
          <Inlet label="1">this should be rendered in the outlet</Inlet>

          <Outlet label="1" />
        </div>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it("should merge the associated Inlet's children to the corresponding outlet", () => {
      const wrapper = renderWithProvider(
        <div>
          <Inlet label="1"><div>first inlet</div></Inlet>
          <Inlet label="1"><div>second inlet</div></Inlet>
          <Inlet label="1"><div>third inlet</div></Inlet>

          <Outlet label="1" />
        </div>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it("Inlet children are sent to their corresponding outlets", () => {
      const wrapper = renderWithProvider(
        <div>
          <Inlet label="1"><div>first inlet</div></Inlet>
          <Inlet label="1"><div>second inlet</div></Inlet>
          <Inlet label="2"><div>third inlet</div></Inlet>

          <div id="outlet1">
            <Outlet label="1" />
          </div>
          <div id="outlet2">
            <Outlet label="2" />
          </div>
        </div>,
      );
      expect(wrapper).toMatchSnapshot();
    });

    it("two outlets with the same label will duplicate the children rendering", () => {
      const wrapper = renderWithProvider(
        <div>
          <Inlet label="1"><div>inlet</div></Inlet>

          <Outlet label="1" />
          <Outlet label="1" />
        </div>,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
