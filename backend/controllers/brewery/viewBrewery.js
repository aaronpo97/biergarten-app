import ServerError from '../../utilities/errors/ServerError.js';
import Brewery from '../../database/models/Brewery.js';

import { boolChecker } from '../../utilities/data/dataUtil.js';
const viewBrewery = async (req, res, next) => {
	try {
		const { id } = req.params;
		const brewery = !boolChecker(req.query.populate)
			? await Brewery.findById(id)
			: await Brewery.findById(id).populate('headerImage').populate('beers').populate('postedBy');

		const status = 200;

		res.json({ message: `success`, status, payload: brewery });
	} catch (error) {
		const { id } = req.params;
		if (error.name === 'CastError') {
			next(new ServerError(`Cannot find a brewery with an id of ${id}.`), 404);
			return;
		}
		next(error);
	}
};

export default viewBrewery;
