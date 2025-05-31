<template>
  <teleport to="body">
    <div v-if="show" class="modal-overlay" @click="onClose">
      <div class="modal-content" @click.stop>
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<script setup>
  const props = defineProps(
    {
      consistent: {
        type: Boolean,
        required: false,
        default: true
      },
    }
  );
  const show = defineModel();
  const emit = defineEmits('close');
  const onClose = () => {
    if(props.consistent) {
      return;
    }
    show.value = false;
    emit('close');
  }
</script>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background: white;
    padding: 10px;
    border-radius: 8px;
  }
</style>
