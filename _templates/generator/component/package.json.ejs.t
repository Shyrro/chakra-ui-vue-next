---
to: packages/<%=h.changeCase.paramCase(name)%>/package.json
---

{
  "name": "<%= '@chakra-ui/' + h.changeCase.paramCase(name)%>",
  "description": "<%= 'Chakra UI Vue | ' + h.changeCase.sentence(description) + ' component'%>",
  "version": "1.0.0",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "author": "Jonathan Bakebwa <codebender828@gmail.com>",
  "homepage": "https://github.com/chakra-ui/chakra-ui-vue-next#readme",
  "license": "MIT",
  "files": [
    "dist"
  ],
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js",
      "default": "./dist/esm/index.js"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chakra-ui/chakra-ui-vue-next.git"
  },
  "bugs": {
    "url": "https://github.com/chakra-ui/chakra-ui-vue-next/issues"
  },
  "sideEffects": false,
  "scripts": {
    "build": "rimraf ./dist && concurrently yarn:build:*",
    "build:esm": "cross-env BABEL_ENV=esm babel src --root-mode upward --extensions .ts,.tsx -d dist/esm --source-maps",
    "build:cjs": "cross-env BABEL_ENV=cjs babel src --root-mode upward --extensions .ts,.tsx -d dist/cjs --source-maps",
    "build:types": "cross-env tsc --emitDeclarationOnly --declaration --declarationDir dist/types",
    "watch": "concurrently yarn:watch:*",
    "watch:esm": "cross-env BABEL_ENV=esm babel src --root-mode upward --extensions .ts,.tsx -d dist/esm --source-maps --watch",
    "watch:cjs": "cross-env BABEL_ENV=cjs babel src --root-mode upward --extensions .ts,.tsx -d dist/cjs --source-maps --watch",
    "watch:types": "cross-env tsc --emitDeclarationOnly --declaration --declarationDir dist/types --watch --incremental"
  },
  "dependencies": {
    "@chakra-ui/styled-system": "^1.9.0",
    "@chakra-ui/vue-system": "*",
    "@chakra-ui/vue-utils": "*"
  },
  "peerDependencies": {
    "vue": ">=3.0.5"
  }
}
