const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const defaultConfig = getDefaultConfig(projectRoot);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = {
    watchFolders: [workspaceRoot],
    transformer: {
        // Lets `import Icon from './icon.svg'` resolve to a react-native-svg
        // component instead of an opaque asset — used for the two custom
        // icons ported straight from the ElectroCalc web prototype
        // (conduit-fill, pe-conductor). Standard lucide icons come from
        // lucide-react-native instead (pre-built components, no transform needed).
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        unstable_enableSymlinks: true,
        nodeModulesPaths: [
            path.resolve(projectRoot, 'node_modules'),
            path.resolve(workspaceRoot, 'node_modules'),
        ],
        // Force every package — including @calc/* workspace symlinks, whose
        // physical files live under packages/*/dist — to resolve react/
        // react-native to this single copy. Without this, a stale or
        // re-hoisted pnpm symlink inside a workspace package's own
        // node_modules can pull in a second React instance, which throws
        // "A React Element from an older version of React was rendered".
        extraNodeModules: {
            react: path.resolve(workspaceRoot, 'node_modules/react'),
            'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
        },
        // .svg moves from "asset" (opaque file Metro just copies) to
        // "source" (parsed and transformed into a component) — the standard
        // react-native-svg-transformer setup.
        assetExts: assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
    },
};

module.exports = mergeConfig(defaultConfig, config);
