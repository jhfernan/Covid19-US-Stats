<template>
	<v-container>
		<c-title title="Covid-19 Stats by State" />

		<v-row>
			<v-col cols="12" sm="12" md="6">
				<v-card class="mx-auto my-3" max-width="344">
					<v-list-item three-line>
						<v-list-item-content>
							<div class="overline mb-1">
								United States Death Rate
							</div>
							<v-list-item-title class="headline mb-1">
								2.66%
							</v-list-item-title>
							<v-list-item-subtitle>As of 10/22/20, based on figures provided by the
								<a
									href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html"
									rel="nofollow"
									target="_blank"> New York Times</a>
							</v-list-item-subtitle>
						</v-list-item-content>

						<v-list-item-avatar
							tile
							size="25">
							<img
								alt="Unites States Flag"
								src="us.png">
						</v-list-item-avatar>
					</v-list-item>
				</v-card>
			</v-col>
			<v-col cols="12" sm="12" md="6">
				<v-card class="mx-auto my-3" max-width="344">
					<v-list-item three-line>
						<v-list-item-content>
							<div class="overline mb-1">
								Worldwide Death Rate
							</div>
							<v-list-item-title class="headline mb-1">
								2.75%
							</v-list-item-title>
							<v-list-item-subtitle>As of 10/22/20, based on figures provided by the
								<a
									href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html"
									rel="nofollow"
									target="_blank"> New York Times</a>
							</v-list-item-subtitle>
						</v-list-item-content>

						<v-list-item-avatar
							tile
							size="25">
							<img
								alt="World Icon"
								src="world.png">
						</v-list-item-avatar>
					</v-list-item>
				</v-card>
			</v-col>
		</v-row>



		<v-data-iterator
			:items="stateData"
			:items-per-page.sync="itemsPerPage"
			:page="page"
			:search="search"
			:sort-by="sortBy.toLowerCase()"
			:sort-desc="sortDesc"
			hide-default-footer>
			<template v-slot:header>
				<v-toolbar class="mb-1" dark>
					<v-text-field
						v-model="search"
						clearable
						flat
						solo-inverted
						hide-details
						prepend-inner-icon="mdi-magnify"
						label="Search" />
					<template v-if="$vuetify.breakpoint.mdAndUp">
						<v-spacer />
						<v-select
							v-model="sortBy"
							flat
							solo-inverted
							hide-details
							:items="keys"
							prepend-inner-icon="mdi-magnify"
							label="Sort by" />
						<v-spacer />
						<v-btn-toggle mandatory v-model="sortDesc">
							<v-btn
								color="blue"
								depressed
								large
								:value="false">
								<v-icon>mdi-arrow-up</v-icon>
							</v-btn>
							<v-btn
								color="blue"
								depressed
								large
								:value="true">
								<v-icon>mdi-arrow-down</v-icon>
							</v-btn>
						</v-btn-toggle>
					</template>
				</v-toolbar>
			</template>

			<template v-slot:default="props">
				<v-row>
					<v-col
						:key="item.state"
						v-for="item in props.items"
						cols="12"
						sm="6"
						md="4"
						lg="3">
						<v-card>
							<v-card-title class="subheading font-weight-bold">
								{{ item.state }}
							</v-card-title>
							<v-divider />
							<v-list dense>
								<v-list-item
									:key="index"
									v-for="(key, index) in filteredKeys">
									<v-list-item-content :class="{ 'blue--text': sortBy === key }">
										{{ key }}:
									</v-list-item-content>
									<v-list-item-content
										class="align-end"
										:class="{ 'blue--text': sortBy === key }">
										{{ item[key.toLowerCase()] | number }}
									</v-list-item-content>
								</v-list-item>
							</v-list>
						</v-card>
					</v-col>
				</v-row>
			</template>

			<template v-slot:footer>
				<v-row
					class="mt-2"
					align="center"
					justify="center"
				>
					<span class="grey--text">Items per page</span>
					<v-menu offset-y>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								dark
								text
								color="primary"
								class="ml-2"
								v-bind="attrs"
								v-on="on"
							>
								{{ itemsPerPage }}
								<v-icon>mdi-chevron-down</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item
								v-for="(number, index) in itemsPerPageArray"
								:key="index"
								@click="updateItemsPerPage(number)"
							>
								<v-list-item-title>{{ number }}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>

					<v-spacer />

					<span
						class="mr-4
						grey--text"
					>
						Page {{ page }} of {{ numberOfPages }}
					</span>
					<v-btn
						fab
						dark
						color="blue darken-3"
						class="mr-1"
						@click="formerPage"
					>
						<v-icon>mdi-chevron-left</v-icon>
					</v-btn>
					<v-btn
						fab
						dark
						color="blue darken-3"
						class="ml-1"
						@click="nextPage"
					>
						<v-icon>mdi-chevron-right</v-icon>
					</v-btn>
				</v-row>
			</template>
		</v-data-iterator>

	</v-container>
</template>

<script>
export default {
	asyncData ({ app, error, params }) {
		return app.$axios.$get('/app.json')
			.then(data => {
				return { data }
			})
			.catch(err => { error({ statusCode: '404', message: 'Data not found' }) })
	},
	data () {
		return {
			itemsPerPageArray: [16, 32, 48, 52],
			search: '',
			filter: {},
			sortDesc: true,
			page: 1,
			itemsPerPage: 16,
			sortBy: 'deaths',
			keys: [
				'Cases',
				'Deaths',
				'Rate'
			],
		}
	},
	computed: {
		stateData () {
			let data = this.data
			for (const i in data) {
				let percent = data[i].deaths / data[i].cases
				data[i].rate = (percent * 100).toFixed(1)
			}
			return data
		},
		filteredKeys () {
			return this.keys.filter(key => key !== 'Name')
		},
		numberOfPages () {
			return Math.ceil(this.data.length / this.itemsPerPage)
		},
	},
	methods: {
		nextPage () {
			if (this.page + 1 <= this.numberOfPages) this.page += 1
		},
		formerPage () {
			if (this.page - 1 >= 1) this.page -= 1
		},
		updateItemsPerPage (number) {
			this.itemsPerPage = number
		},
	},
}
</script>
