<template>
    <svg :x="x" :y="y" :width="width" :height="height" viewBox="0 0 20 20">
        <path d="M3,14.111h8.889V3H3ZM3,23h8.889V16.333H3Zm11.111,0H23V11.889H14.111Zm0-20V9.667H23V3Z"
              transform="translate(-3 -3)" fill="#fff"/>
    </svg>

</template>

<script>
   import Svg       from "@/components/mixins/Svg";

   export default {
      name: 'dashboard',
      mixins: [Svg]
   }
</script>

<style scoped>

</style>