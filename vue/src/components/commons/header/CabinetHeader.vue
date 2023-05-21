<template>
	<div class="w-bgr">
		<div class="top-header">
			<div>
				<div class="logo">
					<a :href="originUrl">
						<Logo :height="65" :width="65"/>
					</a>
					<h1>#НАДОУМЧИК</h1>
				</div>

				<div class="welcome-user">
					<span>{{ `Здравствуйте, ${user.personal.s_name} ${user.personal.f_name}` }}</span>
				</div>
			</div>

			<div class="exit">
				<Button @click="exit"
						class="text-button"
						text="Выход"/>
			</div>
		</div>
	</div>
</template>

<script>
import {
	computed
} from 'vue'
import {useStore} from 'vuex'
import Logo from "@/assets/img/logo";
import {
	Button,
} from 'saffarid-ui-kit'
import {
	removeUser,
	storages
} from "@/js/web";

export default {
	name: "CabinetHeader",
	components: {
		Button,
		Logo
	},
	setup() {
		const store = useStore()
		const user = computed(() => store.getters.user)

		const exit = () => store.dispatch('logout')

		return {
			originUrl: location.origin,
			user,
			exit
		}
	}
}
</script>

<style lang="scss" scoped>

.top-header {
	div:first-child {
		align-items: center;
		display: flex;
		gap: 5px;
	}

	justify-content: space-between;
}

a {
	height: 65px;
}

.welcome-user {
	margin-left: 10px;
}

.exit {
	justify-self: end;
}

</style>