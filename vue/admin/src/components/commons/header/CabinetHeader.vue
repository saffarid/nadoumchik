<template>
    <div class="w-bgr">
        <div class="top-header">
            <div class="logo">
                <a :href="originUrl">
                    <Logo :height="65" :width="65"/>
                </a>
                <h1>#НАДОУМЧИК</h1>
            </div>

            <div class="welcome-user">
                <span>{{`Здравствуйте, ${user.personal.s_name} ${user.personal.f_name}`}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        computed
    }                 from 'vue'
    import {useStore} from 'vuex'
    import Logo       from "@/assets/img/logo";

    export default {
        name: "CabinetHeader",
        components: {
            Logo
        },
        setup() {
            const store = useStore()
            const user = computed(() => store.getters.user)

            return {
                originUrl: location.origin,
                user
            }
        }
    }
</script>

<style lang="scss" scoped>

    a {
        height: 65px;
    }

    .welcome-user {
        margin-left: 10px;
    }

</style>