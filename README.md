# Brickshots

This is simple shotlist manager I use for planning and keeping track of the shots I need to animate for my brickfilms.

Core features:
- List of shots divided into scenes
- Automatic generation of a shotcode based on its position in the scene and the other shots around it
- Manual locking/setting of shotcodes for shots that have been animated, with generated codes automatically adjusting
- Keeping track of location, description, notes and animation status per shot

## Development

Starting the dev server:
```shell
bun run dev
```

Running the tests:
```shell
bun test --watch
```
This will re-run the tests automatically with every file change. If you don't want that behavior, remove the `--watch`
argument.

Build for deployment:
```shell
bun run build
```
