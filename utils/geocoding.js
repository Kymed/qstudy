const axios = require('axios');
const config = require('config');

// A function to get a city with latitude and longitude
module.exports = async (lat, lng) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    key: config.get('geocodingApiKey'),
                    latlng: `${lat}, ${lng}`
                }
            });

            let city = res.data.results[2].address_components[1].long_name;

            resolve(city);

        } catch (err) {
            console.error(err.message);
            reject('Server error');
        }
    });
}
