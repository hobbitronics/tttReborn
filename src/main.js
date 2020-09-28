import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'tic tac toe'
	}
});

export default app;