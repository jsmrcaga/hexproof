Hello fellow Planeswalker!

Thank you for wanting to contribute to Hexproof! It has A LOT of room for improvement and for new features!

# Aim of Hexproof
This project is meant to provide MTG players with a more ergonomic deck builder.

The most ergonomic builder I have ever tried is the one from MTGA. I had high hopes for Scryfall but sadly it does not have
any discovery options.

Hexproofs combines the powerful search from Scryfall with a simple drag & drop interface for building decks. It also provides some
basic stats of the deck and big card previews.

# Project structure

The project is mostly unstructured. It outgrew the size I thought it would take and since then I've gained a lot of experience.
There are a lot of things I would like to change but sadly don't have the time.

As of today the project entrypoint is `src/index.js` who then calls `src/App.js` (classic CRA).

The "decks & collections" view is at `src/views/home` and the collection & deck building views at `src/views/deck-builder.js`.
They use components from `src/components`.

## Preferred & future structure

All components (or group of components) will have to live in their own directories. We will be switching to CSS modules, so this will
allow components to live next to their CSS definitions.

There will be no rules of 1 component = 1 file, we'll just try to keep files small, and components can live together as long
as they have a reason to (for example `ItemList` and `Item` could be in the same file).

# Project cleanup/linting

## Formatting rules
If you're using a fancy IDE or editor please make sure your autoformatting is DISABLED for this project (looking at you VS code).

We WILL NOT use prettier, and using it on your editor will make diffs a lot harder to read when submitting pull requests.

There are not many "pretty code" rules in this repo, just try to keep it readable and it'll be ok.

There is however a preferred format for hooks:
```js
const myHook = React.useSomething(() => {
	definition()
}, [dependencies])
```

Note how we always prefix with `React` (less imports & namespacing for easy understanding).
And notice how the dependencies are at the end of the same line as the definition. Prettier will place the definition
and the dependencies at the same "indentation" level, making it extremely hard to see dependencies.


## EsLint

We use the default ESLint config provided by CRA. Please pay attention to your development server to catch any warnings/errors.

We tolerate `// eslint-disable-*` comments if they make sense, you might get review comments on them if they are not trivial.


# Reviews

The community is welcome to review all Pull Requests as I won't have much time. Keep it clean!
