# @lp-labs/react-tabs

Accessible tabs with keyboard navigation, controlled state and lazy panels. React 18+ peer only; ESM, CommonJS and TypeScript included.

## Installation

```sh
npm install @lp-labs/react-tabs
```

## Quick Start

```jsx
import { Tabs } from '@lp-labs/react-tabs';
export default function Example() {
  return (
    <Tabs
      label="Settings"
      tabs={[
        { id: 'profile', label: 'Profile', content: <p>Profile settings</p> },
        { id: 'security', label: 'Security', content: <p>Security settings</p> },
      ]}
    />
  );
}
```

## API

Tab records: unique id, label, content, optional disabled. Props: tabs, value/defaultValue, onValueChange, orientation='horizontal'/'vertical', activation='automatic'/'manual', lazy=true, keepMounted=false, loop=true, direction='ltr'/'rtl', label, className. Controlled value requires onValueChange. Arrows navigate the configured axis and skip disabled tabs; Home/End reach endpoints; RTL reverses horizontal navigation. Manual mode activates with Enter/Space. Buttons and panels receive linked ARIA IDs.

lazy renders selected content; keepMounted retains previously visited content. With lazy=false all content is mounted but inactive panels remain hidden. If an active tab disappears or becomes disabled, the first enabled tab is used for display. Panel content and styling are fully application-owned.

## Benefits

| Area             | Details                                                          |
| ---------------- | ---------------------------------------------------------------- |
| Keyboard access  | Provide roving tab focus and linked ARIA tab/panel IDs.          |
| Loading strategy | Choose lazy rendering and whether visited panels remain mounted. |
| Controlled state | Integrate with routers or application state.                     |

## Customization

| Area       | Details                                            |
| ---------- | -------------------------------------------------- |
| Activation | Choose automatic or manual tab activation.         |
| Navigation | Set orientation, RTL direction, and wrapping.      |
| Panels     | Choose lazy rendering and retained visited panels. |

## Security And Limits

At most 100 uniquely identified tabs; IDs: 1–128 characters. All-disabled lists have no active panel or tab stop. Custom labels should be presentational, not nested interactive controls. Hidden panel state is not a security boundary: do not mount unauthorized content. Lazy unmounting can discard form state; use keepMounted or lift state deliberately. SSR and client boundaries are supported; no routing, drag-reorder or animation is bundled.

## Support

[Donate via PayPal](https://www.paypal.me/LibinPrasanth). Author: [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/).

## License

MIT License. See the packaged [LICENSE](LICENSE) file.
