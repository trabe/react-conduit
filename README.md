# react-conduit

[![Build Status](https://travis-ci.org/trabe/react-conduit.svg?branch=master)](https://travis-ci.org/trabe/react-conduit)

## Description

react-conduit allows you to render React components anywhere. Typical use case
scenarios are:

* Keep shared state in the parent but render the children anywhere.
* Imperative APIs for things like rendering alerts or confirmations in a different react application and send it to your main application.
* Render componentes in z-indexed layers with ease.


## Installation

```
npm install --save react-conduit
```

## Usage

First and foremost you need to wrap your react componentes with a `<ConduitProvider>`.
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

It's possible to force the order of the elements that are being output at a certain outlet
by passing an `index` prop to the `<Inlet>` (defaults to 0, thus elements are output by registering
in the inlet order). **Negative numbers will be rendered first in the DOM**.

To further customize the element that wraps the outlet you can use both `className` and `style`
props in the `<Outlet>`.

```
import React from "react";
import { Inlet, Outlet, ConduitProvider } from "react-conduit";

<ConduitProvider>
  <div className="divA">
    <p>This paragraph will be a .divA child in the DOM</p>
    <Inlet label="test">
      <p>This paragraph will be the second .divB child in the DOM</p>
    </Inlet>
    <Inlet label="test" index={-1}>
      <p>This paragraph will be the first .divB child in the DOM</p>
    </Inlet>
  </div>

  <Outlet label="test" className="divB" />
</ConduitProvider>
```


## API

### Inlet

| Prop           | Type         | Req?   | Description                                                                   |
| :------------- | :----------- | :----- | :-----------------------------------------------------------------------------|
| label          | string       | ✓      | Label matching one of the outlets                                             |
| index          | integer      |        | Index for ordering the outlet output. Negative indexes will be rendered first |
| onConnect      | func         |        | Callback invoked when a new conduit is connected                              |
| onDisconnect   | func         |        | Callback invoked when a conduit gets disconnected                             |

### Outlet

| Prop         | Type       | Req? | Description                                              |
|:-------------|:-----------|:-----|:---------------------------------------------------------|
| label        | string     |  ✓   | Outlet identifier                                        |
| className    | string     |      | Additional className for the outlet wrapper              |
| style        | object     |      | Additional styles for the outlet wrapper                 |
| onConnect    | func       |      | Callback invoked when a new conduit is connected         |
| onDisconnect | func       |      | Callback invoked when a conduit gets disconnected        |

## CHANGELOG

### v2.0.0

* Update dependencies
* Use config files for tooling instead of package.json entries

### v1.2.0

* Update uuid dependency
* Fix uuid imports to ease the pain of mocking test with jest

### v1.1.0

* Updated all dependencies
* No longer use Sinon and Chai for testing. Just jest.
* Added ESLint + Prettier to make our code nicer

### v1.0.2

* Support for React 16

### v1.0.1

* Fix Inlet ordering not working

### v1.0.0

* Add `onDisconnect` and `onConnect` callbacks to inlets and outlets
* Big refactor. Docs are on their way!

### v0.2.0

* Add index prop to Inlet to allow reordering at output time
* Add className and style props to Outlet to customize the wrapper

### v0.1.1

* Fixed subscription/unsubscription gotchas

### v0.1.0

* Initial release
