/* jshint -W117 */
const fs = require('fs');

const configFile = 'config.json';
const tmpConfigFile = 'config.temp.json';

beforeAll(() => {
  if (fs.existsSync(configFile)) {
    fs.renameSync(configFile, tmpConfigFile);
  }
  expect(fs.existsSync(configFile)).toBeFalsy();
});

afterAll(() => {
  if (fs.existsSync(tmpConfigFile)) {
    fs.renameSync(tmpConfigFile, configFile);
  } else if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile); //remove config file if remaining
  }
});

test('no config', () => {
  if (fs.existsSync(configFile))
    fs.unlinkSync(configFile);
  expect(fs.existsSync(configFile)).toBeFalsy();
  const config = require('../src/config')();
  expect(config).toBeDefined();
  expect(config['node_port']).toBe(3000);
  expect(config['data_dir']).toBe('data');
});

test('invalid config ignored', () => {
  fs.writeFileSync(configFile, 'invalid JSON');
  const config = require('../src/config')();
  expect(config).toBeDefined();
  expect(config['node_port']).toBe(3000);
  expect(config['data_dir']).toBe('data');
});

test('good config merged', () => {
  fs.writeFileSync(configFile, '{"node_port":5000}');
  const config = require('../src/config')();
  expect(config).toBeDefined();
  expect(config['node_port']).toBe(5000);
  expect(config['data_dir']).toBe('data');
});

test('wrong config fixed', () => {
  fs.writeFileSync(configFile, '{"node_port":"hello","data_dir":"data2"}');
  const config = require('../src/config')();
  expect(config).toBeDefined();
  expect(config['node_port']).toBe(3000);
  expect(config['data_dir']).toBe('data2');
});