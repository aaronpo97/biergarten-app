import BeerPost from '../../database/models/BeerPost.js';
import ServerError from '../../utilities/errors/ServerError.js';
import deletePost from '../../utilities/deletion/deletePost.js';

const deleteBeerPost = async (req, res, next) => {
	try {
		const { id } = req.params;
		const post = await BeerPost.findById(id);
		if (!post)
			throw new ServerError(
				`Cannot delete a post with the id: ${id} as it could not be found.`,
				404
			);
		await deletePost(post);
		res.json({ message: `Deleted a post with the id ${id}.`, success: true });
	} catch (error) {
		if (error.type === 'CastError') {
			next(new ServerError('Cannot delete that post as the id is invalid', 400));
		}
		next(error);
	}
};

export default deleteBeerPost;
