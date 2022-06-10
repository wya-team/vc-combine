<template>
	<div class="vca-gallery-category-menu">
		<div class="vca-gallery-category-menu__tools">
			<vc-button type="primary" @click="$emit('upload')">
				上传{{ sourceName }}
			</vc-button>
			<vc-button type="default" @click="$emit('create')">
				添加分组
			</vc-button>
		</div>
		<div class="vca-gallery-category-menu__list">
			<vc-transition-slide group>
				<div
					v-for="item in dataSource"
					:key="item[valueKey.catId]"
					:class="{ 'is-active': modelValue === item[valueKey.catId] }"
					class="vca-gallery-category-menu__item"
					@click="handleCategoryItem(item)"
				>
					<span class="vca-gallery-category-menu__item-name">
						{{ item[valueKey.catName] }}（{{ item[valueKey.count] }}）
					</span>
					<span
						v-if="!item[valueKey.isDefault]"
						class="."
					>
						<vc-icon
							type="edit"
							class="vca-gallery-category-menu__item-icon"
							@click.stop="handleRename(item)"
						/>
						<span class="vca-gallery-category-menu__item-icon-divider">|</span>
						<vc-icon
							type="empty"
							class="vca-gallery-category-menu__item-icon"
							@click.stop="$emit('delete', item)"
						/>
					</span>
				</div>
			</vc-transition-slide>
		</div>
	</div>
</template>

<script setup>
import { Icon as VcIcon, Button as VcButton, Transition } from '@wya/vc';
import { useConfig } from './hooks';

const VcTransitionSlide = Transition.Slide;

const props = defineProps({
	modelValue: {
		type: Number,
		default: 0
	},
	dataSource: {
		type: Array,
		default: () => ([])
	},
});

const emit = defineEmits([
	'update:modelValue',
	'upload',
	'create',
	'delete',
	'rename-category'
]);

const {
	valueKey,
	sourceName
} = useConfig();

const handleCategoryItem = (item) => {
	const { catId } = valueKey;
	if (item[catId] === props.modelValue) return;
	emit('update:modelValue', item[catId]);
};

const handleRename = (category) => {
	emit('rename-category', category);
};
</script>

<style lang="scss">

$c-border: #e9e9e9;

.vca-gallery-category-menu {
	display: flex;
	flex-direction: column;
	height: 100%;
	font-size: 12px;

	// TODO: 使用share模块
	.category-item {
		height: 46px;
		padding-right: 20px;
		padding-left: 20px;
		line-height: 46px;
		cursor: pointer;
		transition: background-color 0.1s;

		&:hover {
			background-color: #f4f4f4;

			.vca-gallery-category-menu__icon-wrapper {
				display: block;
				color: #666;
				text-align: right;
			}
		}
	}

	&__tools {
		display: flex;
		padding: 12px;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1px solid #d9d9d9;
	}

	&__list {
		flex: 1;
		overflow-y: auto;
	}

	&__item {
		display: flex;
		justify-content: space-between;
		background-color: #fff;

		@extend .category-item;

		&.is-active {
			background-color: #f4f4f4;
		}
	}

	&__item-name {
		padding-right: 8px;
		overflow: hidden;
		color: #000;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__icon-wrapper {
		display: none;
		color: #666;
		text-align: right;
		flex-shrink: 0;
	}

	&__item-icon {
		&:hover {
			color: #5495f6;
		}
	}

	&__item-icon-divider {
		margin: 0 5px;
		color: #dbdbdb;
	}
}

</style>
