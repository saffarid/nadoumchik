<template>
    <div class="w_bgr">
        <div class="top-header">
            <div class="logo">
                <Logo :height="65" :width="65"/>
                <h1>#НАДОУМЧИК</h1>
            </div>

            <div class="welcome_user">
                <span>{{`Здравствуйте, ${user.personal.s_name} ${user.personal.f_name}`}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        inject
    }           from 'vue'
    import Logo from "@/assets/img/logo";

    export default {
        name: "CabinetHeader",
        components: {
            Logo
        },
        setup() {
            const user = inject('user')

            return {
                user
            }
        }
    }
</script>

<style lang="scss" scoped>

    .welcome_user {
        margin-left: 10px;
    }

</style>