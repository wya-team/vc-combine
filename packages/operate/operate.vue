<template>
	<div 
		v-if="currentValue.length > 0" 
		:class="{ [`is-${align}`]: true }"
		class="vcc-operate"
	>
		<template v-for="(item, index) in beforeItems" :key="item.label">
			<vcc-operate-item 
				:info="item"
				@ok="handleOk(item)"
				@cancel="handleCancel(item)"
			/>
			<vc-divider
				v-if="index < beforeItems.length - 1 || currentValue.length > outerCount"
				:key="index"
				vertical
			/>
		</template>
			
		<vc-dropdown
			v-if="currentValue.length > outerCount"
			portal-class-name="vcc-dropdown"
			placement="bottom-right"
		>
			<div class="vcc-operate__text">
				<span>更多</span>
				<vc-icon 
					type="down" 
					style="margin-bottom: 2px; transform: scale(0.8);" 
				/>
			</div>
			<template #list>
				<vc-dropdown-menu>
					<template v-for="(item) in currentValue.slice(outerCount)" :key="item.label">
						<!-- 带操作确认的操作项 -->
						<vc-popconfirm
							v-if="item.message && !item.disabled"
							:portal="false"
							:title="item.message"
							tag="li" 
							class="vc-dropdown-item"
							placement="right"
							@ok="handleOk(item)"
							@cancel="handleCancel(item)"
						>
							<!-- 带悬浮提示的 -->
							<vc-popover
								v-if="item.tip"
								:content="item.tip"
								:portal="false"
								placement="top"
								theme="dark"
								tag="div"
							>
								<span>{{ item.label }}</span>
							</vc-popover>
							<!-- 无悬浮提示的 -->
							<div v-else v-text="item.label" />
						</vc-popconfirm>

						<!-- 带悬浮提示的操作项 -->
						<vc-popover
							v-else-if="item.tip"
							:content="item.tip"
							:portal="false"
							class="vcc-operate__item is-tip"
							placement="top"
							theme="dark"
							tag="li"
						>
							<div 
								class="vc-dropdown-item"
								:class="{ 'is-disabled': item.disabled }"
								@click="handleOk(item)"
								v-text="item.label"
							/>
						</vc-popover>

						<!-- 常规操作项 -->
						<vc-dropdown-item
							v-else
							:disabled="item.disabled"
							align="left"
							@click="handleOk(item)"
							v-text="item.label"
						/>
					</template>
				</vc-dropdown-menu>
			</template>
		</vc-dropdown>
	</div>
</template>
<script>
import { defineComponent, computed, watch, ref } from 'vue';
import { Dropdown, Popconfirm, Popover, Icon, Divider } from '@wya/vc';
import Item from './item.vue';

console.log(Popconfirm);
export default defineComponent({
	name: 'vcc-operate',
	components: {
		'vc-dropdown': Dropdown,
		'vc-dropdown-menu': Dropdown.Menu,
		'vc-dropdown-item': Dropdown.Item,
		'vc-icon': Icon,
		'vc-divider': Divider,
		'vc-popconfirm': Popconfirm,
		'vc-popover': Popover,
		'vcc-operate-item': Item
	},
	props: {
		dataSource: Array, // [{ show: boolean, label: string, disabled: boolean, message: string, tip: string }]
		/**
		 * 外部展示的个数，其余的放在“更多”里面；
		 * outerCount 外向的（外向的在外面，内向的躲在“更多”里面）
		 */
		outerCount: {
			type: Number,
			default: 1
		},
		align: {
			type: String,
			default: 'right' // left | center | right
		}
	},
	emits: ['cancel', 'ok', 'click'],
	setup(props, { emit }) {
		const currentValue = ref([]);
		const beforeItems = computed(() => {
			return currentValue.value.slice(0, props.outerCount);
		});

		const handleOk = (item) => {
			if (item.disabled) return;
			emit('click', item.label, item);
			emit('ok', item.label, item);
		};
		const handleCancel = (item) => {
			emit('cancel', item.label, item);
		};

		watch(() => props.dataSource, (v = []) => {
			currentValue.value = v.filter(i => {
				return typeof i.show === 'undefined' || i.show;
			});
		}, {
			immediate: true
		});

		return {
			currentValue,
			beforeItems,
			handleOk,
			handleCancel
		};
	}
});
</script>
<style lang="scss">
.vcc-operate {
	display: flex;
	align-items: center;

	&.is-center {
		justify-content: center;
	}

	&.is-right {
		justify-content: flex-end;
	}
}

.vcc-operate__text {
	color: #5495f6;
	cursor: pointer;
}

.vcc-operate__item {
	&.is-tip {
		list-style: none;
	}
}
</style>
