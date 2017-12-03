'use strict';
import {
	MAKE_IMAGE_FULL_SCREEN,
	REMOVE_IMAGE_FULL_SCREEN
} from '../../actions/action-types';

export const makeImageFullScreen = (src) => ({
	type: MAKE_IMAGE_FULL_SCREEN,
	payload: {src}
});

export const removeFullScreenImage = () => ({
	type: REMOVE_IMAGE_FULL_SCREEN
});