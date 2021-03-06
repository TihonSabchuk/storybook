import path from 'path';
import mergeDirs from 'merge-dirs';
import { getVersions, getPackageJson, writePackageJson } from '../../lib/helpers';

export default async npmOptions => {
  const [
    storybookVersion,
    addonActionVersion,
    addonKnobsVersion,
    babelCoreVersion,
    babelRuntimeVersion,
  ] = await getVersions(
    npmOptions,
    '@storybook/marko',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    'babel-core',
    'babel-runtime'
  );

  mergeDirs(path.resolve(__dirname, 'template/'), '.', 'overwrite');

  const packageJson = getPackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@storybook/marko'] = storybookVersion;
  packageJson.devDependencies['@storybook/addon-actions'] = addonActionVersion;
  packageJson.devDependencies['@storybook/addon-knobs'] = addonKnobsVersion;

  if (!packageJson.dependencies['babel-core'] && !packageJson.devDependencies['babel-core']) {
    packageJson.devDependencies['babel-core'] = babelCoreVersion;
  }
  if (!packageJson.dependencies['babel-runtime'] && !packageJson.devDependencies['babel-runtime']) {
    packageJson.devDependencies['babel-runtime'] = babelRuntimeVersion;
  }

  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts.storybook = 'start-storybook -p 6006';
  packageJson.scripts['build-storybook'] = 'build-storybook';

  writePackageJson(packageJson);
};
