'use strict';
const awsParamStore = require('aws-param-store');
const Sequelize = require('sequelize');
var find = require('lodash/find');

const parameters = awsParamStore.getParametersByPathSync('/', { region: 'us-east-1' })

const DB_HOST = find(parameters, ['Name', 'DB_HOST']).Value
const DB_NAME = find(parameters, ['Name', 'DB_NAME']).Value
const DB_PASSWORD = find(parameters, ['Name', 'DB_PASSWORD']).Value
const DB_USERNAME = find(parameters, ['Name', 'DB_USERNAME']).Value
const REDIS_HOST = find(parameters, ['Name', 'REDIS_HOST']).Value
const REDIS_PORT = find(parameters, ['Name', 'REDIS_PORT']).Value
const sequalize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    logging: console.log,
});
const redisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    logging: console.log
}
module.exports = {
    sequalize: sequalize,
    redisOptions: redisOptions
}
