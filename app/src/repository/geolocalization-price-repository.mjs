/**
 * Geolocalization price repository for database interactions.
 */
class GeolocalizationPriceRepository {

    /**
     * Creates a geolocalization price repository.
     * 
     * @param {Object} conn The database connection.
     */
    constructor(conn) {
        this.conn = conn;
    }

    /**
     * Gets the price of a product in supermarkets that are within
     * a certain radius (km) of a geolocation point referred by a
     * latitude and longitude.
     * 
     * @param {String} name The name of the product.
     * @param {latitude} latitude The latitude of the geolocation.
     * @param {longitude} longitude The longitude of the geolocation.
     * @param {radius} radius The radius in km.
     * @returns A promise that resolves to a list of supermarkets and prices.
     */
    get(name, latitude, longitude, radius) {
        return this
            .conn('price as pc')
            .innerJoin(
                'supermarket as sm',
                'pc.supermarketId',
                'sm.id'
            )
            .innerJoin(
                'product as pd',
                'pc.productId',
                'pd.id'
            )
            .select(
                'sm.name as supermarketName',
                'sm.street',
                'sm.number',
                'sm.neighborhood',
                'sm.zipCode',
                'sm.city',
                'sm.state',
                'sm.latitude',
                'sm.longitude',
                'pd.name as productName',
                'pc.price'
            )
            .where(
                'pd.name',
                'ilike',
                `%${name}%`
            )
            .andWhere(
                'pc.date',
                '=',
                this.conn('price')
                    .max('date')
                    .whereRaw('"supermarketId" = sm.id AND "productId" = pd.id')
            )
            .andWhere(
                this.conn.raw(
                    `(
                        6371 * acos
                        (
                            cos(radians(?)) * cos(radians(sm.latitude)) *
                            cos(radians(sm.longitude) - radians(?)) +
                            sin(radians(?)) * sin(radians(sm.latitude))
                        )
                    ) < ?`,
                    [latitude, longitude, latitude, radius]
                )
            ).then((rows) => {
                const result = {};

                rows.forEach((row) => {
                    const {
                        supermarketName, street, number, neighborhood, zipCode,
                        city, state, latitude, longitude, productName, price
                    } = row;

                    if (!result[productName]) {
                        result[productName] = {};
                    }

                    result[productName][supermarketName] = {
                        price,
                        address: {
                            street,
                            number,
                            neighborhood,
                            zipCode,
                            city,
                            state,
                            latitude,
                            longitude
                        }
                    };
                });

                return result;
            });
    }
}

export default GeolocalizationPriceRepository;