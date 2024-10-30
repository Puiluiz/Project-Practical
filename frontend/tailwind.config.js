/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				mitr: ['Mitr', 'sans-serif']
			},
			fontWeight: {
				extralight: 200,
				light: 300,
				regular: 400,
				medium: 500,
				semibold: 600,
				bold: 700
			}
		}
	},
	plugins: []
};
