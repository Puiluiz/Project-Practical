<script>
	import { onMount } from 'svelte';

	let users = []; // Stores all users
	let formData = { username: '', password: '', role: '' }; // Stores user data for editing
	let editingUser = null; // Tracks the user being edited
	let showManageModal = false; // Manages the display of the manage modal
	let showSearchModal = false; // Manages the display of the search modal
	let search = ''; // ID for search

	let selected = 'USER'; // The selected role from the dropdown
	let options = ['USER', 'ADMIN']; // Role options for the dropdown

	let role = ''; // Role to be fetched from localStorage
	let username = ''; // Username to be fetched from localStorage

	// Pagination variables
	let currentPage = 1; // Current page number
	const itemsPerPage = 10; // Number of users per page
	let totalPages = 1; // Total number of pages

	// Fetch all users (for the initial table load)
	async function fetchUsers() {
		try {
			const response = await fetch('http://localhost:3000/users');
			users = await response.json();
			totalPages = Math.ceil(users.length / itemsPerPage); // Calculate total pages
		} catch (error) {
			console.error('Error fetching users:', error);
		}
	}

	// Open the modal for managing users
	function openManageModal(user) {
		showManageModal = true;
		editingUser = user;
		formData = { username: user.username, password: '', balance: user.balance, role: user.role };
		selected = user.role;
	}

	// // Update the user information
	// async function updateUser() {
	// 	try {
	// 		const updateData = {
	// 			balance: Number(formData.balance), // Update balance
	// 			role: selected
	// 		};

	// 		if (formData.password) {
	// 			updateData.password = formData.password; // Only include password if it's entered
	// 		}

	// 		const response = await fetch(`http://localhost:3000/users/${editingUser.id}/update-password-admin`, {
	// 			method: 'PUT',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify(updateData)
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error(`Error updating user: ${response.statusText}`);
	// 		}

	// 		await fetchUsers();
	// 		showManageModal = false;
	// 	} catch (error) {
	// 		console.error('Error updating user:', error);
	// 	}
	// }

		// Update the user information
		async function updateUser() {
		try {
			const updateData = {
				balance: Number(formData.balance), // Update balance
				role: selected
			};

			if (formData.password) {
				updateData.password = formData.password; // Only include password if it's entered
			}

			const response = await fetch(`http://localhost:3000/users/${editingUser.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			if (!response.ok) {
				throw new Error(`Error updating user: ${response.statusText}`);
			}

			await fetchUsers();
			showManageModal = false;
		} catch (error) {
			console.error('Error updating user:', error);
		}
	}

	// Delete a user
	async function deleteUser(id) {
		try {
			const response = await fetch(`http://localhost:3000/users/${id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error(`Error deleting user: ${response.statusText}`);
			}

			await fetchUsers();
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	}

	// Search users based on ID, username, or email
	async function searchUser() {
		const params = new URLSearchParams();

		// Build query parameters based on which fields are filled
		if (search) {
			params.append('q', search);
		}

		const queryString = params.toString();

		// Update the URL without reloading the page
		const newUrl = queryString ? `?${queryString}` : window.location.pathname;
		window.history.replaceState(null, '', newUrl);

		try {
			// Fetch users based on the query string
			const response = await fetch(`http://localhost:3000/users?${queryString}`);
			const fetchedUsers = await response.json();

			console.log('Fetched users:', fetchedUsers); // Check the data received

			if (fetchedUsers.length === 0) {
				alert('No users found with the given criteria.');
			}

			// Update the users array to trigger a re-render
			users = fetchedUsers;

			// Recalculate total pages based on search results
			totalPages = Math.ceil(users.length / itemsPerPage);
			currentPage = 1; // Reset to first page after search
			showSearchModal = false; // Close the modal after search
		} catch (error) {
			console.error('Error searching user:', error);
		}
	}

	// Get the paginated data for the current page
	function paginatedData(data, page) {
		const start = (page - 1) * itemsPerPage;
		const end = page * itemsPerPage;
		return data.slice(start, end);
	}

	// Navigate to the next page
	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	// Navigate to the previous page
	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	// On mount, check user role and fetch users if the user is an admin
	onMount(() => {
		role = localStorage.getItem('role');
		username = localStorage.getItem('username');

		// Check if the role is ADMIN, if not redirect to the homepage
		if (role !== 'ADMIN') {
			alert('You do not have permission to access this page.');
			window.location.href = '/Homepage';
		} else {
			fetchUsers(); // Fetch users when the page loads if the user is an admin
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
					<a href="/Manage-User" class="underline font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Manage-User</a>
				</button>
				<button>
					<a href="/log" class="font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Log</a>
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

		<!-- Table displaying users -->
		<div class="flex flex-col items-center h-screen text-center py-[100px]">
			<table
				class="table-auto border-collapse border border-slate-500 w-full max-w-full overflow-x-auto"
			>
				<thead>
					<tr>
						<th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">ID</th>
						<th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Email</th>
						<th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Username</th>
						<th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Password</th>
						<th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Balance</th>
						<th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Role</th>
						<th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Manage</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedData(users, currentPage) as user}
						<tr>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{user.id}</td>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{user.email}</td>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3"
								>{user.username}</td
							>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3"
								>{user.password}</td
							>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{user.balance}</td
							>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{user.role}</td>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">
								<button
									class="font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-1 rounded mr-2"
									on:click={() => openManageModal(user)}>Manage</button
								>
								<button
									class="font-mitr font-regular bg-[#BD4C52] text-white px-4 py-1 rounded"
									on:click={() => deleteUser(user.id)}>Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<!-- Pagination controls -->
			<div class="flex space-x-2 text-black">
				<button class="font-mitr font-regular mt-5 bg-[#FFFFFF] p-2 rounded-xl text-[#2C2C2C]" on:click={prevPage} disabled={currentPage === 1}>Previous</button>
				<button class="font-mitr font-regular mt-5 bg-[#FFFFFF] p-2 rounded-xl text-[#2C2C2C]" on:click={nextPage} disabled={currentPage === totalPages}>Next</button>
			</div>

		</div>
	</div>
</div>

<!-- Manage User Modal -->
<!-- Manage User Modal -->
{#if showManageModal}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
		<div class="bg-white p-4 rounded-lg">
			<h3>Manage User</h3>
			<input bind:value={formData.password} type="password" placeholder="New Password (optional)" />
			<input bind:value={formData.balance} type="number" placeholder="New Balance" />
			<select bind:value={selected}>
				{#each options as value}
					<option {value}>{value}</option>
				{/each}
			</select>
			<button on:click={updateUser}>Save</button>
			<button on:click={() => (showManageModal = false)}>Close</button>
		</div>
	</div>
{/if}

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
