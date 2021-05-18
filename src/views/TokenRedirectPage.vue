<template>
  <div v-if="hasError">
    Something went wrong during openIdConnect login.
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
export default defineComponent({
  name: 'UnauthorizedRedirectPage',
  props: {
    hasErrored: {
      type: Boolean,
      default: false

    }
  },
  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const hasError = ref<boolean>(false)
    const accessCode = route.query.code
    store.dispatch('fetchTokens', accessCode).then(
      (redirectPath: any) => {
        router.push({ path: redirectPath })
      },
      (error: any) => {
        hasError.value = true
      }
    )
    return {
      hasError
    }
  }
})
</script>
