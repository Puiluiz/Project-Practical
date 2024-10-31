<script  lang="ts">
	import { onMount } from 'svelte';

	interface Historytopup {
		userId: number;
		transactionId:  number;
  	transactionName: String;
  	amount:         number;
	}

	let username = '';
	let balance = 0;
	let role = '';
	let topupHistory = []; // Stores top-up history data

	let historyTopup: Historytopup[] = [];
	let showSearchModal = false; // Manages the display of the search modal
	let search = ''; // ID for search
	// Pagination variables
	let currentPage = 1;
	const itemsPerPage = 10;
	let totalPages = 1;

	onMount(() => {
		const usernameFromStorage = localStorage.getItem('username');
		const roleFromStorage = localStorage.getItem('role') || '';

		if (usernameFromStorage) {
			username = usernameFromStorage;
			role = roleFromStorage; // เก็บ role

			// Fetch top-up history data after login
			async function fetchTopupHistory() {
				try {
					// Fetch top-up history data
					const historyResponse = await fetch(`http://localhost:3000/history/topup`);
					topupHistory = await historyResponse.json();
					console.log('Fetched topupHistory:', topupHistory);
				} catch (error) {
					console.error('Error fetching top-up history data:', error);
				}
			}

			fetchTopupHistory();
		}
	});

		// Search products based on search term or user ID
		async function searchUser() {
		const params = new URLSearchParams();

		if (search) {
			params.append('q', search);
		} else {
			alert('Please enter a User ID or Product Name to search.');
			return; // Exit the function if no search term is provided
		}

		const queryString = params.toString();
		const newUrl = queryString ? `?${queryString}` : window.location.pathname;
		window.history.replaceState(null, '', newUrl);

		try {
			const response = await fetch(`http://localhost:3000/history/topup?${queryString}`);

			// Check if the fetch was successful
			if (!response.ok) {
				throw new Error('Failed to fetch data from server');
			}

			const fetchHistoryTopup = await response.json();

			console.log(fetchHistoryTopup);

			if (fetchHistoryTopup.length === 0) {
				alert('No data found with the given criteria.');
			}

			topupHistory = fetchHistoryTopup;
			totalPages = Math.ceil(historyTopup.length / itemsPerPage);
			currentPage = 1; // Reset to the first page after search
			showSearchModal = false; // Close the modal after search
		} catch (error) {
			console.error('Error searching products:', error);
			alert('An error occurred while searching. Please try again later.');
		}
	}

	// Get paginated data for the current page
	function paginatedData() {
		const start = (currentPage - 1) * itemsPerPage;
		return historyTopup.slice(start, start + itemsPerPage);
	}

	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}

	function prevPage() {
		if (currentPage > 1) currentPage--;
	}
</script>

<div class="mx-auto w-full text-white text-center h-screen">
	<div class="relative bg-gradient-to-t from-[#B5BAE4] to-[#FFFFFF] h-screen">
		<!-- หัวด้านบน -->
		<div class="bg-[#B5BAE4] h-[70px] sm:h-[90px] md:h-[100px] w-full flex items-center justify-center relative">
			<div class="absolute left-5 sm:left-8 md:left-10">
				<button>
					<h1 class="text-[#2C2C2C] font-semibold text-base sm:text-lg md:text-2xl bg-[#FFE3DE] flex items-center justify-center rounded-3xl px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="1.43em" height="1em" viewBox="0 0 256 180" class="mr-2">
							<path fill="#f00" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/>
							<path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/>
						</svg>
						<a href="/Homepage-Admin">YouTubePreAcc-Admin</a>
					</h1>
				</button>
			</div>

			<div class="absolute right-5 sm:right-8 md:right-10 flex items-center space-x-2 sm:space-x-4 md:space-x-5 lg:space-x-8">
				<button>
					<a href="/Homepage" class="font-mitr font-regular bg-white text-[#2C2C2C] text-xs sm:text-sm md:text-lg lg:text-xl px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-3xl hover:bg-gray-100 drop-shadow-md">BackUser</a>
				</button>
				<button>
					<a href="/Manage-Products" class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Manage-Products</a>
				</button>
				<button>
					<a href="/Manage-User" class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Manage-User</a>
				</button>
				<button>
					<a href="/log" class="underline font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Log</a>
				</button>
				<div class="flex items-center ml-20">
					<span class="font-mitr font-regular text-xs md:text-lg text-[#2C2C2C] ml-2">{username}</span>
				</div>
			</div>
		</div>

		<!-- Search Button -->
		<div class="py-[50px] absolute right-5 md:right-10 flex space-x-4 md:space-x-10 lg:space-x-20">
			<button
				class="font-mitr font-regular bg-[#98BC79] text-[#FFFFFF] px-4 py-1 rounded mr-2"
				on:click={() => (showSearchModal = true)}>Search</button
			>
		</div>

		<!-- Main content -->
		<div class="flex flex-col items-center h-screen text-center py-[100px]">
			<div>
				<button
					><a
						href="/log"
						class="font-mitr bg-white text-[#2C2C2C] px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-xl drop-shadow-md"
						>ประวัติการซื้อ</a
					></button
				>
				<button
					><a
						href="/logtopup"
						class="ml-10 font-mitr bg-[#FFE3DE] text-[#2C2C2C] px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-xl hover:bg-gray-100 drop-shadow-md"
						>ประวัติการเติม</a
					></button
				>
			</div>

			<!-- Top-up history table -->
			<table
				class="mt-10 table-auto border-collapse border border-slate-500 w-full max-w-full overflow-x-auto"
			>
				<thead>
					<tr>
						<th
							class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3"
							>ID</th
						>
						<th
							class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3"
							>UserID</th
						>
                        <th
                        class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3"
                        >Transaction Name</th
                    >
						<th
							class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3"
							>Amount</th
						>
					</tr>
				</thead>
				<tbody>
					{#each topupHistory as history}
						<tr>
							<td
								class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3"
								>{history.id}</td
							>
							<td
								class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3"
								>{history.userId}</td
							>
                            <td
								class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3"
								>{history.transactionName}</td
							>
							<td
								class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3"
								>{history.amount}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
						<!-- Pagination Controls -->
						<div class="flex space-x-2 text-black">
							<button class="font-mitr font-regular mt-5 bg-[#FFFFFF] p-2 rounded-xl text-[#2C2C2C]" on:click={prevPage} disabled={currentPage === 1}>Previous</button>
							<button class="font-mitr font-regular mt-5 bg-[#FFFFFF] p-2 rounded-xl text-[#2C2C2C]" on:click={nextPage} disabled={currentPage === totalPages}>Next</button>
						</div>
		</div>
	</div>
</div>

<!-- Search User Modal -->
{#if showSearchModal}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
		<div class="font-mitr font-regular bg-white p-4 rounded-lg">
			<h3>Search User</h3>
			<input bind:value={search} type="text" placeholder="Search" />
			<button class="font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-1 rounded mr-2" on:click={searchUser}>Search</button>
			<button class="font-mitr font-regular bg-[#BD4C52] text-white px-4 py-1 rounded" on:click={() => (showSearchModal = false)}>Close</button>
		</div>
	</div>
{/if}