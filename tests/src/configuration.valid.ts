import {Configuration, DeepNestedConfiguration, NestedConfiguration} from "./configuration";

export const validConfiguration = new Configuration();
validConfiguration.host = 'localhost';
validConfiguration.port = 3000;

validConfiguration.nested = new NestedConfiguration();

export const validDeepNestedConfiguration = new DeepNestedConfiguration();
validDeepNestedConfiguration.text = 'lorem ipsum';

validConfiguration.nested.deeper = validDeepNestedConfiguration;
