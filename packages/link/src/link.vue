<template>
  <a
    :href="disabled ? null : href"
    :class="[disabled && 'disabled', !underlined && 'underlined']"
  >
    <slot></slot
  ></a>
</template>

<script>
export default {
  name: 'WangLink',
  props: {
    href: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    underlined: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.disabled {
  cursor: not-allowed;
}
.underlined {
  text-decoration: none;
}
</style>
