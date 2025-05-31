<script
	setup
	lang="ts"
>

const props = withDefaults(defineProps<{
	src?: string,
	size?: number,
	ratio?: number,
	transformation?: string
}>(),{
	size: 16,
	ratio: 1,
	transformation: 'c_auto'
});
const responsiveClass = ref<string[]>([]);
const transformUrl = computed(() => {
	if(!props.src?.includes('/image/upload/v')){
		return props.src;
	}
	let px: number = 32;
	switch (props.size) {
		case 8: {
			px = 32;
			break;
		}
		case 16: {
			px = 64;
			break;
		}
		case 24: {
			px = 96;
			break;
		}
		case 32: {
			px = 128;
			break;
		}
		case 40: {
			px = 160;
			break;
		}
		case 48: {
			px = 192;
			break;
		}
		case 56: {
			px = 224;
			break;
		}
	}
	let hw = `h_${px},w_${props.ratio*px}`;
	responsiveClass.value = [`h-${props.size}`, props.ratio > 0 ? `w-${props.size*props.ratio}` : ''];
	return props.src?.replace('/image/upload/v', `/image/upload/${props.transformation},${hw}/v`)
})
</script >

<template >
	<ClientOnly>
		<img class="object-contain" :class="responsiveClass" :src="transformUrl" />
	</ClientOnly>
</template >

<style scoped>

</style >