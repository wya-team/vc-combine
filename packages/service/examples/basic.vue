<template>
	<div>
		<h4>{{ v1 }}</h4>
		<h4>{{ v2 }}</h4>
		<h4>{{ v3 }}</h4>
		<h2>以上数据相同</h2>
		<h4>{{ v4 }}</h4>
		<h4>{{ v5 }}</h4>
		<h2>以上数据相同</h2>
		<h4>{{ v6 }}</h4>
	</div>
	<h1>-----------------</h1>
	<div>
		<h4>{{ v11 }}</h4>
		<h4>{{ v22 }}</h4>
		<h4>{{ v33 }}</h4>
		<h2>以上数据相同</h2>
		<h4>{{ v44 }}</h4>
		<h4>{{ v55 }}</h4>
		<h2>以上数据相同</h2>
		<h4>{{ v66 }}</h4>
	</div>
</template>

<script setup>
import { ajax } from '@wya/http';
import { useMemoryData, useCacheData } from './hooks';

app.config.globalProperties.$request = ajax;

const { memoryData: v1 } = useMemoryData();
const { memoryData: v2 } = useMemoryData();
const { memoryData: v3 } = useMemoryData();
const { memoryData: v4 } = useMemoryData({
	param: { name: 1 }
});
const { memoryData: v5 } = useMemoryData({
	param: { name: 1 }
});
const { memoryData: v6 } = useMemoryData({
	param: { name: 2 }
});

const { cacheData: v11 } = useCacheData();
const { cacheData: v22 } = useCacheData();
const { cacheData: v33 } = useCacheData();
const { cacheData: v44 } = useCacheData({
	param: { name: 11 }
});
const { cacheData: v55 } = useCacheData({
	param: { name: 11 }
});
const { cacheData: v66 } = useCacheData({
	param: { name: 22 }
});

</script>