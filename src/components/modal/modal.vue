<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal">
      <div class="modal-content">
        <slot></slot>
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["isOpen"],
  emits: ["close"],
  setup(_, { emit }) {
    function closeModal() {
      emit("close");
    }
    return { closeModal };
  },
};
</script>

<style>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
