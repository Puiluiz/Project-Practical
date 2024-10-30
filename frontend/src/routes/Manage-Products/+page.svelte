<script>
    import { onMount } from 'svelte';
	import { Button, Modal, Table } from 'flowbite-svelte';

    let products1Month = [];
    let products12Months = [];
    let currentPage1 = 1;
    let currentPage2 = 1;
    const itemsPerPage = 10;
    let showAddForm = false;
    let showEditForm = false; 
    let formData = { email: '', password: '', price: '', expire: '' };
    let editingProduct = null; 
    let role = ''; 
    let username = ''; 

    onMount(() => {
        role = localStorage.getItem('role');
        username = localStorage.getItem('username');

        if (role !== 'ADMIN') {
            alert('You do not have permission to access this page.');
            window.location.href = '/Homepage';
        } else {
            fetchProducts();
        }
    });

    async function fetchProducts() {
        try {
            const response1 = await fetch('http://localhost:3000/products/1month');
            products1Month = await response1.json();

            const response2 = await fetch('http://localhost:3000/products/12months');
            products12Months = await response2.json();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function addProduct(productType) {
        console.log(formData.expire);
        
        const apiUrl = productType === '1month'
            ? 'http://localhost:3000/products/1month'
            : 'http://localhost:3000/products/12months';

        if (!formData.email || !formData.password || !formData.price || !formData.expire) {
            console.error('กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error adding product: ${response.statusText}`);
            }

            await fetchProducts();
            showAddForm = false;
            resetFormData();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }

    function openEditForm(product) {
        showEditForm = true;
        formData = { ...product }; 
        editingProduct = product; 
    }

    async function manageProduct() {
        const productId = editingProduct.id;
        const productType = editingProduct.productType;

        const apiUrl = productType === '1month'
            ? `http://localhost:3000/products/1month/${productId}`
            : `http://localhost:3000/products/12months/${productId}`;

        if (!formData.email || !formData.password || !formData.price || !formData.expire) {
            console.error('กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error managing product: ${response.statusText}`);
            }

            await fetchProducts();
            showEditForm = false;
        } catch (error) {
            console.error('Error managing product:', error);
        }
    }

    async function deleteProduct(productId, productType) {
        const apiUrl = productType === '1month'
            ? `http://localhost:3000/products/1month/${productId}`
            : `http://localhost:3000/products/12months/${productId}`;

        try {
            await fetch(apiUrl, { method: 'DELETE' });
            await fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    function paginatedData(data, page) {
        const start = (page - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    }

    function nextPage(pageNumber, setPage, totalItems) {
        const maxPage = Math.ceil(totalItems / itemsPerPage);
        setPage(Math.min(pageNumber + 1, maxPage));
    }

    function prevPage(pageNumber, setPage) {
        setPage(Math.max(1, pageNumber - 1));
    }

    function setPage1(page) {
        currentPage1 = page;
    }

    function setPage2(page) {
        currentPage2 = page;
    }

    function resetFormData() {
        formData = { email: '', password: '', price: '', expire: '' };
    }

	// Helper function to format date
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	function remainingDays(dateString) {
		const date = new Date(dateString);
		return Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
	}
</script>

<style>
    .input-field {
        display: block;
        width: 100%;
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .btn {
        padding: 8px 12px;
        border-radius: 4px;
    }
    .btn-primary {
        background-color: #4CAF50;
        color: white;
    }
    .btn-secondary {
        background-color: #2196F3;
        color: white;
    }
    .btn-danger {
        background-color: #f44336;
        color: white;
    }
    .table-header {
        background-color: #B5BAE4;
    }
    .modal {
        position: fixed;
        inset: 0;
        flex: 1;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
    }
</style>

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
					<a href="/Manage-Products" class="underline font-mitr font-regular text-sm md:text-lg lg:text-xl text-[#2C2C2C]">Manage-Products</a>
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

        <div class="py-[50px] absolute right-5 md:right-10 flex space-x-4 md:space-x-10 lg:space-x-20">
            <button class="font-mitr font-regular bg-[#98BC79] text-[#FFFFFF] px-4 py-1 rounded mr-2" on:click={() => (showAddForm = true)}>Add Product</button>
        </div>

        <div class="flex flex-col items-center h-screen text-center py-[100px]">

            {#if showAddForm}
                <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:w-1/2">
                        <h3 class="font-mitr font-regular bg-[#98BC79] text-[#FFFFFF] px-4 py-1 rounded mr-2">Add Product</h3>
                        <input bind:value={formData.email} placeholder="Email" class="font-mitr font-regular text-[#2C2C2C] input-field w-full mt-2 mb-2 p-2 border rounded" />
                        <input bind:value={formData.password} placeholder="Password" class="font-mitr font-regular text-[#2C2C2C] input-field w-full mb-2 p-2 border rounded" />
                        <input bind:value={formData.price} placeholder="Price" class="font-mitr font-regular text-[#2C2C2C] input-field w-full mb-2 p-2 border rounded" />
                        <input type="date" bind:value={formData.expire} class="font-mitr font-regular text-[#2C2C2C] input-field w-full mb-2 p-2 border rounded" />
                        <div class="flex justify-end mt-4">
                            <button class="font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-2 rounded hover:bg-blue-500 transition" on:click={() => addProduct('1month')}>Submit for 1 Month</button>
                            <button class="font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-2 rounded hover:bg-blue-500 transition ml-2" on:click={() => addProduct('12months')}>Submit for 12 Months</button>
                            <button class="font-mitr font-regular bg-[#BD4C52] text-white px-4 py-2 rounded hover:bg-red-500 transition ml-2" on:click={() => (showAddForm = false)}>Close</button>
                        </div>
                    </div>
                </div>
            {/if}


            <h1 class="font-mitr font-regular text-2xl md:text-4xl mb-4 text-[#2C2C2C]">Products for 1 Month</h1>
            <table class="table-auto border-collapse border border-slate-500 w-full mt-4">
                <thead class="table-header ">
                    <tr>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">ID</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Email</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Password</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Price</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Expire</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {#each paginatedData(products1Month, currentPage1) as product}
                        <tr>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.id}</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.email}</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.password}</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.price}</td>
							<td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{formatDate(product.expire)} ({remainingDays(product.expire)} days left)</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">
                                <button class="btn btn-secondary font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-1 rounded mr-2" on:click={() => openEditForm(product)}>Edit</button>
                                <button class="btn btn-danger font-mitr font-regular bg-[#BD4C52] text-white px-4 py-1 rounded" on:click={() => deleteProduct(product.id, '1month')}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div class="flex space-x-2 text-black">
                <button class="font-mitr font-regular text-[#2C2C2C]" on:click={() => prevPage(currentPage1, setPage1)} disabled={currentPage1 === 1}>Previous</button>
                <button class="font-mitr font-regular text-[#2C2C2C]" on:click={() => nextPage(currentPage1, setPage1, products1Month.length)} disabled={currentPage1 === Math.ceil(products1Month.length / itemsPerPage)}>Next</button>
            </div>

            {#if showEditForm}
                <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 sm:w-1/2">
                        <h3 class="font-mitr font-regular bg-[#98BC79] text-[#FFFFFF] px-4 py-1 rounded mr-2">Edit Product</h3>
                        <input bind:value={formData.email} placeholder="Email" class="input-field font-mitr font-regular text-[#2C2C2C]" />
                        <input bind:value={formData.password} placeholder="Password" class="input-field font-mitr font-regular text-[#2C2C2C]" />
                        <input bind:value={formData.price} placeholder="Price" class="input-field font-mitr font-regular text-[#2C2C2C]" />
                        <input type="date" bind:value={formData.expire} class="input-field font-mitr font-regular text-[#2C2C2C]" />
                        <div class="flex justify-end mt-4">
                            <button class="font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-2 rounded hover:bg-blue-500 transition ml-2" on:click={manageProduct}>Update Product</button>
                            <button class="font-mitr font-regular bg-[#BD4C52] text-white px-4 py-2 rounded hover:bg-red-500 transition ml-2" on:click={() => (showEditForm = false)}>Close</button>
                        </div>
                    </div>
                </div>
            {/if}

            <h2 class="font-mitr font-regular text-2xl md:text-4xl mb-4 text-[#2C2C2C]">Products for 12 Months</h2>
            <table class="table-auto border-collapse border border-slate-500 w-full mt-4">
                <thead class="table-header">
                    <tr>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">ID</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Email</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Password</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Price</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Expire</th>
                        <th class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFE3DE] p-3">Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {#each paginatedData(products12Months, currentPage2) as product}
                        <tr>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.id}</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.email}</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.password}</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{product.price}</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">{formatDate(product.expire)} ({remainingDays(product.expire)} days left)</td>
                            <td class="font-mitr font-regular border border-slate-600 text-[#2C2C2C] bg-[#FFFFFF] p-3">
                                <button class="btn btn-secondary font-mitr font-regular bg-[#6CAAF0] text-white px-4 py-1 rounded mr-2" on:click={() => openEditForm(product)}>Edit</button>
                                <button class="btn btn-danger font-mitr font-regular bg-[#BD4C52] text-white px-4 py-1 rounded" on:click={() => deleteProduct(product.id, '12months')}>Delete</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <div class="flex space-x-2 text-black">
                <button class="font-mitr font-regular text-[#2C2C2C]" on:click={() => prevPage(currentPage1, setPage1)} disabled={currentPage1 === 1}>Previous</button>
                <button class="font-mitr font-regular text-[#2C2C2C]" on:click={() => nextPage(currentPage1, setPage1, products1Month.length)} disabled={currentPage1 === Math.ceil(products1Month.length / itemsPerPage)}>Next</button>
            </div>
        </div>
    </div>
</div>
