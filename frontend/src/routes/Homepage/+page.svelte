<script>
	import { onMount } from 'svelte';

	let username = '';
	let balance = 0;
	let role = ''; // เก็บ role ของผู้ใช้

	onMount(() => {
		const usernameFromStorage = localStorage.getItem('username');
		const userIDFromStorage = localStorage.getItem('userID');
		const roleFromStorage = localStorage.getItem('role') || ''; // ดึง role จาก localStorage

		if (usernameFromStorage) {
			username = usernameFromStorage;
			role = roleFromStorage; // เก็บ role

			// Fetch user data and balance after login
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
		}
	});
</script>

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
                        <h1 class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">History</h1>
                    </a>
                </button>

                <button>
                    <a href="/topup">
                        <h1 class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Top-up</h1>
                    </a>
                </button>

				<!-- Display Username -->
				<button>
                    <a href="/profile" class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" class="h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]">
                            <path fill="#ffe3de" fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0a4.5 4.5 0 0 1-9 0M3.751 20.105a8.25 8.25 0 0 1 16.498 0a.75.75 0 0 1-.437.695A18.7 18.7 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695" clip-rule="evenodd"/>
                        </svg>
                        <span class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C] ml-2">{username}</span>
                    </a>
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

<!-- ข้อความตรงกลาง -->
<div class="flex flex-col items-center h-screen text-center py-[70px] sm:py-[100px] md:py-[150px] lg:py-[200px]">
	<div class="relative flex mb-10">
		<h1 class="font-mitr font-regular text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2C2C]">YouTubePreAcc</h1>
	</div>    
	
	<button>
		<h1 class="font-mitr font-regular text-[#2C2C2C] text-base sm:text-lg md:text-xl lg:text-2xl bg-[#FFE3DE] flex items-center justify-center rounded-3xl px-2 py-1 sm:px-4 sm:py-2 drop-shadow-md">
			<a href="/product">See more products</a>
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" class="ml-2">
				<path fill="none" stroke="#2c2c2c" stroke-miterlimit="10" stroke-width="32" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64Z"/>
				<path fill="none" stroke="#2c2c2c" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M338.29 338.29L448 448"/>
			</svg>
		</h1>
	</button>
</div>

<!-- ด้านล่าง -->
<div class="absolute bottom-0 bg-[#B5BAE4] h-[60px] sm:h-[70px] md:h-[80px] lg:h-[100px] w-screen flex justify-center items-center space-x-5 md:space-x-8 lg:space-x-10">

	<button>
		<a href="/">
			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256" class="h-[25px] sm:h-[30px] md:h-[40px] lg:h-[50px] w-[25px] sm:w-[30px] md:w-[40px] lg:w-[50px] drop-shadow-md bg-white p-2 rounded-full shadow-md">
				<g fill="none">
					<rect width="256" height="256" fill="#5865f2" rx="60"/>
					<g clip-path="url(#skillIconsDiscord0)">
						<path fill="#fff" d="M197.308 64.797a165 165 0 0 0-40.709-12.627a.62.62 0 0 0-.654.31c-1.758 3.126-3.706 7.206-5.069 10.412c-15.373-2.302-30.666-2.302-45.723 0c-1.364-3.278-3.382-7.286-5.148-10.412a.64.64 0 0 0-.655-.31a164.5 164.5 0 0 0-40.709 12.627a.586.586 0 0 0-.275.241c-25.672 38.79-32.554 76.406-29.109 113.763a.67.67 0 0 0 .255.482a165.75 165.75 0 0 0 40.743 20.717a.616.616 0 0 0 .674-.241a118.42 118.42 0 0 0 9.518-15.527a.61.61 0 0 0-.325-.854a133.315 133.315 0 0 1-19.158-9.056a.623.623 0 0 1-.061-1.047a102.747 102.747 0 0 0 3.853-3.075a.6.6 0 0 1 .636-.065c40.125 18.522 83.457 18.522 123.37 0a.608.608 0 0 1 .636.065c1.24.989 2.497 2.086 3.854 3.075a.62.62 0 0 1-.047 1.047a125.946 125.946 0 0 1-19.157 9.056a.61.61 0 0 0-.325.854a132.188 132.188 0 0 0 9.518 15.527a.614.614 0 0 0 .674.241a165.689 165.689 0 0 0 40.743-20.717a.647.647 0 0 0 .255-.482c3.615-37.922-5.72-75.345-29.109-113.763a.517.517 0 0 0-.274-.241ZM98.964 151.064c-10.61 0-19.341-9.652-19.341-21.56c0-11.908 8.585-21.56 19.341-21.56c10.78 0 19.342 9.777 19.341 21.56c0 11.783-8.561 21.56-19.341 21.56Zm58.13 0c-10.61 0-19.34-9.652-19.34-21.56c0-11.908 8.585-21.56 19.34-21.56c10.78 0 19.342 9.777 19.34 21.56c0 11.783-8.56 21.56-19.34 21.56Z"/>
					</g>
				</g>
			</svg>
		</a>
	</button>
</div>
	</div>
</div>
