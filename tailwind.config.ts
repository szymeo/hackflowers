import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			scale: {
				200: '2'
			}
		}
	},

	plugins: [typography, aspectRatio]
} as Config;
