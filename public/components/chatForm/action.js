'use strict';

import {
	HIDE_EMOJIS,
	IMAGE_UPLOAD,
	REMOVE_IMAGE,
	SHOW_EMOJIS
} from '../../actions/action-types';

export const showEmojis = () => ({
	type: SHOW_EMOJIS
});

export const hideEmojis = () => ({
	type: HIDE_EMOJIS
});

export const imageUpload = (image, format, name) => ({
	type: IMAGE_UPLOAD,
	payload: {image, format, name}
});

export const removeImage = (position) => ({
	type: REMOVE_IMAGE,
	payload: {position}
});

