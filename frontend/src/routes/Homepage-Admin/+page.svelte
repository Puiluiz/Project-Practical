<script>
	import { onMount } from 'svelte';

	let username = '';
	let balance = 0;
	let role = '';
	let totalSales = 0;
	let monthlySales = 0;
	let totalUsers = 0;

	onMount(() => {
		const usernameFromStorage = localStorage.getItem('username');
		const userIDFromStorage = localStorage.getItem('userID');
		const roleFromStorage = localStorage.getItem('role') || '';

		if (roleFromStorage !== 'ADMIN') {
			alert('You do not have permission to access this page.');
			window.location.href = '/Homepage';
		} else {
			username = usernameFromStorage;
			role = roleFromStorage;
			console.log('Role from storage:', role);

			// Fetch user data and balance
			async function fetchUserData() {
				try {
					const response = await fetch(`http://localhost:3000/users/${userIDFromStorage}`);
					const userData = await response.json();
					if (userData && userData.balance !== undefined) {
						balance = userData.balance;
						localStorage.setItem('balance', balance.toString());
					}
				} catch (error) {
					console.error('Error fetching user data:', error);
				}
			}
			fetchUserData();

			// Fetch summary data
			async function fetchSummaryData() {
				try {
					const response = await fetch('http://localhost:3000/summary');
					const summaryData = await response.json();
					totalSales = summaryData.totalSales || 0;
					monthlySales = summaryData.monthlySales || 0;
					totalUsers = summaryData.totalUsers || 0;
				} catch (error) {
					console.error('Error fetching summary data:', error);
				}
			}
			fetchSummaryData();
		}
	});
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
					<a href="/log" class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Log</a>
				</button>
				<div class="flex items-center ml-20">
					<span class="font-mitr font-regular text-xs md:text-lg text-[#2C2C2C] ml-2">{username}</span>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="flex flex-col items-center justify-center py-10 md:py-[100px] space-y-10 md:space-y-0 md:flex-row md:space-x-10 relative z-10">
			<!-- กล่องยอดขายทั้งหมด -->
			<div class="flex flex-col items-center w-full sm:w-[90%] md:w-[400px] h-[200px]">
				<div class="flex flex-col items-center justify-center bg-[#FFE3DE] rounded-3xl shadow-md p-5 md:p-8 h-full w-full">
					<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C] mb-4">ยอดขายทั้งหมด</h1> 
					<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C]">{totalSales}</h1> 
				</div>
			</div>

			<!-- กล่องยอดขายรายเดือน -->
			<div class="flex flex-col items-center w-full sm:w-[90%] md:w-[400px] h-[200px]">
				<div class="flex flex-col items-center justify-center bg-[#FFE3DE] rounded-3xl shadow-md p-5 md:p-8 h-full w-full">
					<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C] mb-4">ยอดขายรายเดือน</h1> 
					<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C]">{monthlySales}</h1> 
				</div>
			</div>

			<!-- กล่องผู้ใช้งานทั้งหมด -->
			<div class="flex flex-col items-center w-full sm:w-[90%] md:w-[400px] h-[200px]">
				<div class="flex flex-col items-center justify-center bg-[#FFE3DE] rounded-3xl shadow-md p-5 md:p-8 h-full w-full">
					<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C] mb-4">ผู้ใช้งานทั้งหมด</h1> 
					<h1 class="font-mitr font-regular text-2xl md:text-3xl text-[#2C2C2C]">{totalUsers}</h1> 
				</div>
			</div>
		</div>
	</div>
</div>

