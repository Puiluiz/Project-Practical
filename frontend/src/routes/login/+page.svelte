<script>
	let username = '';
	let password = '';

	// Function to log in the user
	async function loginUser() {
		try {
			const response = await fetch('http://localhost:3000/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					password: password
				})
			});

			const data = await response.json();
			console.log('Login Response:', data); // Log การตอบกลับทั้งหมดเพื่อยืนยันโครงสร้าง

			if (response.ok) {
				// บันทึก username, userID, และ role ใน localStorage
				localStorage.setItem('username', data.loginResult.user.username);
				localStorage.setItem('userID', data.loginResult.user.id);
				localStorage.setItem('role', data.loginResult.user.role);

				// เปลี่ยนเส้นทางไปหน้า homepage หลังจากเข้าสู่ระบบสำเร็จ
				window.location.href = '/Homepage';
			} else {
				console.error('Login failed:', data.message || data.error);
				alert('Login failed: ' + (data.message || data.error));
			}
		} catch (error) {
			console.error('Error:', error);
			alert('เกิดข้อผิดพลาดในระหว่างการเข้าสู่ระบบ');
		}
	}
</script>

<!-- Login page HTML structure -->
<div class="mx-auto w-full text-white text-center h-full">
	<!-- bg -->
    <div class="relative isolate bg-gradient-to-t from-[#B5BAE4] to-[#FFFFFF] h-screen md:h-screen lg:h-screen xl:h-screen ">

        <!-- หัวด้านบน -->
        <div class="bg-[#B5BAE4] h-[100px] w-screen flex items-center justify-center "> 

            <div class="absolute left-5 md:left-10">
                <button>
                    <h1 class="font-mitr font-regular text-[#2C2C2C] text-lg md:text-2xl bg-[#FFE3DE] flex items-center justify-center rounded-3xl px-3 py-1 md:px-4 md:py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.43em" height="1em" viewBox="0 0 256 180" class="mr-2 ">
                            <path fill="#f00" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/>
                            <path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/>
                        </svg>
                        <a href="/">YouTubePreAcc</a>
                    </h1>
                </button>
            </div>
        </div>

		<!-- Main Content -->
		<div class="flex items-center justify-center py-[50px] lg:py-[100px]">
			<div
				class="bg-[#FFE3DE] rounded-2xl shadow-md p-5 md:p-10 w-[90%] md:w-[800px] lg:w-[1000px] h-[auto] lg:h-[600px] flex flex-col md:flex-row items-center justify-center"
			>
				<!-- ด้านซ้าย -->
                <div class="text-center mb-10 md:mr-10 lg:mr-20">
                    <h1 class="font-mitr font-regular text-4xl md:text-5xl lg:text-6xl text-[#2C2C2C] mb-6">Log in</h1>

                </div>

				<!-- Right Side -->
				<div class="flex flex-col w-full md:w-1/2 space-y-4">
					<label for="username" class="font-mitr font-regular block text-[#2C2C2C] text-left text-lg md:text-xl lg:text-2xl mb-1"
						>Username</label
					>
					<input
						type="text"
						bind:value={username}
						placeholder="Username"
						class="font-mitr font-regular w-full p-2 md:p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B5BAE4] text-[#2C2C2C]"
					/>

					<label for="password" class="font-mitr font-regular block text-[#2C2C2C] text-left text-lg md:text-xl lg:text-2xl mb-1"
						>Password</label
					>
					<input
						type="password"
						bind:value={password}
						placeholder="Password"
						class="font-mitr font-regular w-full p-2 md:p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B5BAE4] text-[#2C2C2C]"
					/>

					<div class="flex justify-end items-center">
						<a href="/signup" class="font-mitr font-regular text-[#2C2C2C] mr-10">Create account</a>
						<button
							on:click={loginUser}
							class="font-mitr font-regular bg-white text-[#2C2C2C] px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-3xl hover:bg-gray-100 drop-shadow-md"
							>Log in</button
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
