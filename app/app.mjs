import knexconfig from './knexfile.js';
import knex from 'knex';
import GeolocalizationPriceRepository from './src/repository/geolocalization-price-repository.mjs';

/**
 * Handles a get-data request.
 * 
 * @param {Object} event The event to be handled.
 * @returns A HTTP-prepared response.
 */
const lambdaHandler = async (event) => {
    let conn = null;

    try {
        const name = event.queryStringParameters.name;
        const latitude = event.multiValueQueryStringParameters.latlng[0];
        const longitude = event.multiValueQueryStringParameters.latlng[1];
        const radius = 7;

        conn = knex(knexconfig);

        const repository = new GeolocalizationPriceRepository(conn);

        const result = await repository.get(name, latitude, longitude, radius);

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: e.message
        }
    } finally {
        if (conn) {
            conn.destroy();
        }
    }
};

export { lambdaHandler };