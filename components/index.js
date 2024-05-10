import CircleTabBar from './tab-bar/index.vue';
let components = {
	CircleTabBar
}

const install = (Vue) => {
	Object.keys(components).forEach((componentName) => {
		Vue.component(componentName, components[componentName]);
	});
};

export default {
	install
};