<script>
	import { onDestroy, onMount } from 'svelte';

	let username = '';
	let balance = 0; // User's balance
	let role = ''; // User's role
	let showProfileModal = false;

    function toggleProfileModal() {
        showProfileModal = !showProfileModal;
    }

		function closeProfileModal(event) {
        // ตรวจสอบว่า target ของคลิกไม่ได้อยู่ใน navbar
        if (!event.target.closest('#profile-navbar') && !event.target.closest('#profile-button')) {
            showProfileModal = false;
        }
    }

		onMount(() => {
		document.addEventListener('click', closeProfileModal);
		});

		onDestroy(() => {
        // ลบ event listener เมื่อ destroy component
        document.removeEventListener('click', closeProfileModal);
    });

	// Check if localStorage is available and get the username, balance, and role after login
	if (typeof window !== 'undefined') {
		username = localStorage.getItem('username') || ''; // Get username from localStorage
		balance = parseFloat(localStorage.getItem('balance') || '0');
		role = localStorage.getItem('role') || ''; // Get user role
	}

	let products1Months = [];
	let products12Months = [];

	// Fetch data from API
	async function fetchProducts() {
		try {
			const res1Months = await fetch('http://localhost:3000/products/1month');
			products1Months = await res1Months.json();

			const res12Months = await fetch('http://localhost:3000/products/12months');
			products12Months = await res12Months.json();
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	}

	// Fetch products when the page loads
	fetchProducts();
</script>

<div class="mx-auto w-full text-white text-center h-full">
	<!-- bg -->
	<div class="relative isolate bg-gradient-to-t from-[#B5BAE4] to-[#FFFFFF] h-screen">
		<!-- หัวด้านบน -->
		<div class="bg-[#B5BAE4] h-[70px] md:h-[100px] w-full flex items-center justify-between px-4">
			<!-- Logo ด้านซ้าย -->
			<div class="flex-shrink-0">
				<button>
					<h1
						class="font-mitr font-regular text-[#2C2C2C] text-lg md:text-2xl bg-[#FFE3DE] flex items-center justify-center rounded-3xl px-3 py-1 md:px-4 md:py-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.43em"
							height="1em"
							viewBox="0 0 256 180"
							class="mr-2"
						>
							<path
								fill="#f00"
								d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"
							/>
							<path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z" />
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
				<button>
					<a href="/product">
						<h1 class="underline font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">
							Products
						</h1>
					</a>
				</button>

				<button>
					<a href="/history">
						<h1 class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">
							History
						</h1>
					</a>
				</button>

				<button>
					<a href="/topup">
						<h1 class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">
							Top-up
						</h1>
					</a>
				</button>

				<!-- ปุ่มเพื่อเปิด/ปิด navbar -->
				<button id="profile-button" on:click={toggleProfileModal} class="flex items-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]">
							<path fill="#ffe3de" fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0M3.751 20.105a8.25 8.25 0 0 1 16.498 0a.75.75 0 0 1-.437.695A18.7 18.7 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695" clip-rule="evenodd"/>
					</svg>
					<span class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C] ml-2">{username}</span>
				</button>

				<!-- เมนู navbar ด้านขวา -->
				{#if showProfileModal}
					<div id="profile-navbar" class="fixed top-0 right-0 h-full w-64 bg-white bg-opacity-75 flex flex-col items-center p-6">
							<div class="text-[#2C2C2C] font-mitr font-regular w-full">
									<h3 class="text-lg font-regular mb-4 bg-[#FFE3DE] rounded-lg p-4 drop-shadow-2xl">Profile Options</h3>
									<button class="w-full mb-2">
											<a href="/profile" class="font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-1 rounded w-full text-center block">Edit profile</a>
									</button>
									<button class="w-full">
											<a href="/" class="font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-1 rounded w-full text-center block">Log out</a>
									</button>
							</div>
					</div>
				{/if}

				<!-- Display Balance -->
				<button class="flex items-center">
					<a href="/topup" class="flex items-center">
						<img
							src="../src/lib/images/Diamond.png"
							alt="coin"
							class="h-[20px] w-[20px] md:h-[30px] md:w-[30px] lg:h-[40px] lg:w-[40px]"
						/>
						<h1
							class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C] ml-1 md:ml-2"
						>
							{balance}
						</h1>
					</a>
				</button>
			</div>
		</div>

		<!-- Product list -->
		<div
			class="flex flex-col items-center justify-center py-10 md:py-[100px] space-y-10 md:space-y-0 md:flex-row md:space-x-10"
		>
			<!-- Product 1 -->
			<div class="flex flex-col items-center">
				<button
					class="flex flex-col items-center justify-center bg-[#FFE3DE] rounded-3xl shadow-md p-5 md:p-8 w-[90%] md:w-[400px] h-[500px]"
				>
					<a href="/product-detail-1">
						<h1 class="font-mitr font-regular text-3xl md:text-3xl text-[#2C2C2C] mb-4 md:mb-6">
							1 MONTH
						</h1>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.43em"
							height="1em"
							viewBox="0 0 256 180"
							class="w-[150px] h-[150px] md:w-[200px] md:h-[200px] mb-4 md:mb-6"
						>
							<path
								fill="#f00"
								d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"
							/>
							<path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z" />
						</svg>

						<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C]">
							IN STOCK {products1Months.length}
						</h1>
					</a>
				</button>

				<button class="mt-4">
					<a
						href="product-detail-1"
						class="font-mitr font-regular bg-white text-lg md:text-xl text-[#2C2C2C] px-4 py-2 border border-gray-300 rounded-3xl hover:bg-gray-100 drop-shadow-md"
						>Order now</a
					>
				</button>
			</div>

			<!-- Product 2 -->
			<div class="flex flex-col items-center">
				<button
					class="flex flex-col items-center justify-center bg-[#FFE3DE] rounded-3xl shadow-md p-5 md:p-8 w-[90%] md:w-[400px] h-[500px]"
				>
					<a href="/product-detail-12">
						<h1 class="font-mitr font-regular text-3xl md:text-3xl text-[#2C2C2C] mb-4 md:mb-6">
							12 MONTH
						</h1>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.43em"
							height="1em"
							viewBox="0 0 256 180"
							class="w-[150px] h-[150px] md:w-[200px] md:h-[200px] mb-4 md:mb-6"
						>
							<path
								fill="#f00"
								d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"
							/>
							<path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z" />
						</svg>

						<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C]">
							IN STOCK {products12Months.length}
						</h1>
					</a>
				</button>

				<button class="mt-4">
					<a
						href="product-detail-12"
						class="font-mitr font-regular bg-white text-lg md:text-xl text-[#2C2C2C] px-4 py-2 border border-gray-300 rounded-3xl hover:bg-gray-100 drop-shadow-md"
						>Order now</a
					>
				</button>
			</div>
		</div>
	</div>
</div>
