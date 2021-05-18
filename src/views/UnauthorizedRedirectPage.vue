<template>
    <div v-if="hasErrored">Something went wrong during openIdConnect redirect.</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({

  name: 'UnauthorizedRedirectPage',
  props: {
    hasErrored: {
      type: Boolean,
      default: false
    }
  },
  setup (props, context) {
    const store = useStore()
    store.dispatch('openid/login')
  }
})
</script>
