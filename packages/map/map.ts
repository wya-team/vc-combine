import { onMounted, h, ref, defineComponent, getCurrentInstance } from 'vue';
import MapManager from './map-manager';

export default defineComponent({
	name: "vcc-map",
	props: {
		id: {
			type: String,
			required: true
		},
		tag: {
			type: [String, Object],
			default: 'div'
		},
		ui: {
			type: Boolean,
			default: false
		},
		options: {
			type: Object
		}
	},
	emits: ['ready'],
	setup(props, { emit, slots }) {
		let mapManager = ref();
		let instance = getCurrentInstance();
		onMounted(() => {
			mapManager.value = new MapManager({
				el: props.id,
				ui: props.ui,
				...props.options
			});
			
			mapManager.value?.ready?.(() => {
				emit('ready', mapManager.value);
			});
		});

		// @ts-ignore
		instance && (instance.proxy.mapManager = mapManager);
		return () => {
			return h(props.tag, {
				id: props.id
			}, slots?.default?.());
		};
	}
});


