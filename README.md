# react-conduit

## Description

react-conduit allows you to render React components anywhere. Typical use case
scenarios are:

* Keep shared state in the parent but render the children anywhere.
* Render componentes in z-indexed layers with ease.

Similiar to https://github.com/tajo/react-portal but components are always rendered
inside the React application.


## Installation

```
npm install --save react-conduit
```

## Usage

First and foremost you need to wrap your react componentes with a `ConduitProvider`.
After that you use an `<Inlet>` to wrap the components you need to render and drop 
an `<Outlet>` wherever you want the components to be rendered.

```
import React from "react";
import { Inlet, Outlet, ConduitProvider } from "react-conduit";

<ConduitProvider>
  <div className="divA">
    <p>This paragraph will be a .divA child in the DOM</p>
    <Inlet label="test">
      <p>This paragraph will be a .divB child in the DOM</p>
    </Inlet>
  </div>

  <div className="divB">
    <Outlet label="test" />
  </div>
</ConduitProvider>
```

You can drop several inlets and outlets in your application. Components inside inlets
will be rendered on outlets based on their labels.

**NOTE**: using the same label in several outputs will replicate the inlet-ed components.

## API

### Inlet

| Prop     | Type       | Req? | Description                          |
|:---------|:-----------|:-----|:-------------------------------------|
| label    | string     |  ✓   | Label matching one of the outlets    |
| index    | integer    |      | Index for ordering the outlet output |

### Outlet

| Prop     | Type       | Req? | Description       |
|:---------|:-----------|:-----|:------------------|
| label    | string     |  ✓   | Outlet identifier |

## CHANGELOG

### v0.1.1

* Fixed subscription/unsubscription gotchas

### v0.1.0

* Initial release
