<template>
    <div class="w_bgr">
        <div class="top-header">
            <div class="logo">
                <Logo :height="65" :width="65"/>
                <h1>#НАДОУМЧИК</h1>
            </div>
        </div>
    </div>
</template>

<script>
    import Logo from "@/assets/img/logo";

    export default {
        name: "CabinetHeader",
        components: {
            Logo
        },
        setup() {

            return {}
        }
    }
</script>

<style lang="scss" scoped>


    /*@media (max-width: 600px) {*/
    /*    .top-header {*/
    /*        height: auto;*/
    /*        display: block;*/
    /*        row-gap: 2px;*/
    /*    }*/
    /*}*/
</style>