<script>
	    import { onMount } from 'svelte';

let username = '';
let balance = 0;
let role = '';
let topupHistory = [];
// Pagination settings
let currentPageTopup = 1;
const itemsPerPageTopup = 10;

let isDropdownOpen = false;

// Toggle dropdown for user menu
function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
}

// Logout function
function handleLogout() {
		localStorage.clear();
		window.location.href = '/login';
}

// Function to fetch user and top-up data
onMount(() => {
		const usernameFromStorage = localStorage.getItem('username');
		const userIDFromStorage = localStorage.getItem('userID');
		const roleFromStorage = localStorage.getItem('role') || '';

		if (usernameFromStorage) {
				username = usernameFromStorage;
				role = roleFromStorage;

				async function fetchUserData() {
						try {
								const userResponse = await fetch(`http://localhost:3000/users/${userIDFromStorage}`);
								const userData = await userResponse.json();

								if (userData && userData.balance !== undefined) {
										balance = userData.balance;
										localStorage.setItem('balance', balance.toString());
								}

								const historyResponse = await fetch(
										`http://localhost:3000/history/topup/${userIDFromStorage}`
								);
								topupHistory = await historyResponse.json();
						} catch (error) {
								console.error('Error fetching user or history data:', error);
						}
				}

				fetchUserData();
		}
});

// Pagination functions for top-up history
function paginatedTopupHistory(data, page) {
		const start = (page - 1) * itemsPerPageTopup;
		return data.slice(start, start + itemsPerPageTopup);
}

function nextPageTopup() {
		const maxPage = Math.ceil(topupHistory.length / itemsPerPageTopup);
		currentPageTopup = Math.min(currentPageTopup + 1, maxPage);
}

function prevPageTopup() {
		currentPageTopup = Math.max(1, currentPageTopup - 1);
}
</script>

<style>
	/* กำหนด CSS ให้ dropdown เป็นแนวตั้ง */
	.dropdown-menu {
			position: absolute;
			top: 60px;
			right: 0;
			width: 200px;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
			z-index: 10;
	}

	.dropdown-item {
			padding: 10px;
			font-size: 18px;
			color: #4A4A4A;
			text-align: left;
	}

	.dropdown-item:hover {
			background-color: #f0f0f0;
	}
</style>

<div class="mx-auto w-full text-white text-center h-full">
	<div class="relative isolate bg-gradient-to-t from-[#B5BAE4] to-[#FFFFFF] h-full">
		<!-- หัวด้านบน -->
        <div class="bg-[#B5BAE4] h-[70px] md:h-[100px] w-full flex items-center justify-between px-4">
            <!-- Logo ด้านซ้าย -->
            <div class="flex-shrink-0">
                <button>
                    <h1 class="font-mitr font-regular text-[#2C2C2C] text-lg md:text-2xl bg-[#FFE3DE] flex items-center justify-center rounded-3xl px-3 py-1 md:px-4 md:py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.43em" height="1em" viewBox="0 0 256 180" class="mr-2">
                            <path fill="#f00"
                                d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/>
                            <path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/>
                        </svg>
                        <a href="/Homepage">YouTubePreAcc</a>
                    </h1>
                </button>
            </div>

			<div class="flex items-center space-x-4 md:space-x-6 lg:space-x-8">
				<!-- ตรวจสอบ role ว่าเป็น ADMIN หรือไม่ ถ้าใช่แสดง ManageProducts และ ManageUser -->
				{#if role === 'ADMIN'}
					<button>
						<a
							href="/Homepage-Admin"
							class="font-mitr font-regular bg-white text-[#2C2C2C] text-xs sm:text-sm md:text-lg lg:text-xl px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-3xl hover:bg-gray-100 drop-shadow-md"
							>AdminManage</a
						>
					</button>
				{/if}

				<!-- Display Products, History, Top-up -->
				<button class="flex items-center ml-10">
					<a href="/product" class="flex items-center">
						<h1 class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Products</h1>
					</a>
				</button>


                <button>
                    <a href="/history">
                        <h1 class="underline font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">History</h1>
                    </a>
                </button>

                <button>
                    <a href="/topup">
                        <h1 class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Top-up</h1>
                    </a>
                </button>

				<!-- Display Username และ Dropdown -->
				<button on:click={toggleDropdown} class="relative flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]">
							<path fill="#ffe3de" fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0M3.751 20.105a8.25 8.25 0 0 1 16.498 0a.75.75 0 0 1-.437.695A18.7 18.7 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695" clip-rule="evenodd"/>
					</svg>
					<span class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C] ml-2">{username}</span>

					{#if isDropdownOpen}
							<div class="dropdown-menu">
									<button on:click={() => window.location.href = '/profile'} class="font-mitr font-regular dropdown-item">Manage Password</button>
									<button on:click={handleLogout} class="font-mitr font-regular dropdown-item">Logout</button>
							</div>
					{/if}
			</button>

				<!-- Display Balance -->
				<button class="flex items-center">
                    <a href="/topup" class="flex items-center">
                        <img src="../src/lib/images/Diamond.png" alt="coin"
                            class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] lg:h-[40px] lg:w-[40px]">
                        <h1 class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C] ml-1 md:ml-2">{balance}</h1>
                    </a>
                </button>
			</div>
		</div>

		<!-- Content -->
		<div class="flex flex-col items-center h-screen text-center py-[100px]">
			<div>
				<button
					><a
						href="/history"
						class="font-mitr bg-white text-[#2C2C2C] px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-xl hover:bg-gray-100 drop-shadow-md"
						>ประวัติการซื้อ</a
					></button
				>
				<button
					><a
						href="/history-topup"
						class="ml-10 font-mitr bg-[#FFE3DE] text-[#2C2C2C] px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-xl drop-shadow-md"
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
							>Transaction Name</th
						>
						<th
							class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3"
							>Amount</th
						>
					</tr>
				</thead>
				<tbody>
					{#each paginatedTopupHistory(topupHistory, currentPageTopup) as history}
                    <tr>
                        <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{history.id}</td>
                        <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{history.transactionName}</td>
                        <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{history.amount}</td>
                    </tr>
                {/each}
				</tbody>
			</table>

			<!-- Pagination Controls -->
			<div class="flex space-x-2 text-black mt-4">
				<button class="font-mitr font-regular bg-[#FFFFFF] p-2 rounded-xl text-[#2C2C2C]" on:click={prevPageTopup} disabled={currentPageTopup === 1}>Previous</button>
				<button class="font-mitr font-regular bg-[#FFFFFF] p-2 rounded-xl text-[#2C2C2C]" on:click={nextPageTopup} disabled={currentPageTopup === Math.ceil(topupHistory.length / itemsPerPageTopup)}>Next</button>
		</div>
		</div>
	</div>
</div>
