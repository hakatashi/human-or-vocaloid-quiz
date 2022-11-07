import viteYaml from '@modyfi/vite-plugin-yaml';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteYaml(),
	],
	server: {
		headers: {
			'Access-Control-Allow-Origin': '',
		},
	},
});
