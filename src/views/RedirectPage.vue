<template>
    <div/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Component()
export default class RedirectPage extends Vue {
    mounted () {
        const accessCode = this.$route.query.code
        this.$store.dispatch('fetch-new-tokens', accessCode)
    }
}
</script>
