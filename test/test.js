const cart = [];
const cartItemsElement = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartModalOverlay = document.getElementById('cart-modal-overlay');
const cartModal = document.getElementById('cart-modal');
const closeCartModalButton = document.getElementById('close-cart-modal');
const cartLink = document.getElementById('cart-link');

const productModalOverlay = document.getElementById('product-modal-overlay');
const productModal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalColors = document.getElementById('color-select');
const modalSizes = document.getElementById('size-select');
const closeProductModalButton = document.getElementById('close-product-modal');
const addToCartModalButton = document.getElementById('add-to-cart-modal');
const loginLogoutLink = document.getElementById('login-logout-link');

const loginModalOverlay = document.getElementById('login-modal-overlay');
const loginModal = document.getElementById('login-modal');
const loginButton = document.getElementById('login-button');
const closeLoginModalButton = document.getElementById('close-login-modal');
const loginError = document.getElementById('login-error');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

let isLoggedIn = false;

function updateCart() {
    cartItemsElement.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price} - 顏色: ${item.color} - 尺寸: ${item.size}`;

        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');

        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.classList.add('btn-decrease');
        decreaseButton.style.color = 'white';
        decreaseButton.style.backgroundColor = '#444';
        decreaseButton.onclick = () => {
            item.quantity--;
            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }
            updateCart();
        };

        const quantityText = document.createElement('span');
        quantityText.textContent = item.quantity;
        quantityText.classList.add('item-quantity');

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.classList.add('btn-increase');
        increaseButton.style.color = 'white';
        increaseButton.style.backgroundColor = '#444';
        increaseButton.onclick = () => {
            item.quantity++;
            updateCart();
        };

        quantityContainer.appendChild(decreaseButton);
        quantityContainer.appendChild(quantityText);
        quantityContainer.appendChild(increaseButton);

        li.appendChild(quantityContainer);
        cartItemsElement.appendChild(li);

        total += item.price * item.quantity;
    });

    totalPriceElement.textContent = `總價: $${total}`;

    // 儲存購物車到 localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}


function openCartModal() {
    if (isLoggedIn) {
        cartModalOverlay.style.display = 'block';
        cartModal.style.display = 'block';
    } else {
        alert('請先登入以查看購物車');
    }
}

function closeCartModal() {
    cartModalOverlay.style.display = 'none';
    cartModal.style.display = 'none';

    if (cart.length === 0) {
        alert('您的購物車裡沒商品');
    } else {
        // 假設結帳成功，清空購物車並顯示結帳成功訊息
        cart.length = 0; // 清空購物車
        updateCart(); // 更新購物車顯示
        alert('結帳成功！謝謝您的購買');
    }
}

function openProductModal(product) {
    if (isLoggedIn) {
        modalImage.src = product.image;
        modalTitle.textContent = product.name;
        modalDescription.textContent = `描述: ${product.description}`;
        modalPrice.textContent = `價格: $${product.price}`;

        // 清空並填充顏色選擇
        modalColors.innerHTML = '';
        product.colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            modalColors.appendChild(option);
        });

        // 清空並填充尺寸選擇
        modalSizes.innerHTML = '';
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            modalSizes.appendChild(option);
        });

        productModalOverlay.style.display = 'block';
        productModal.style.display = 'block';

        // 設置加入購物車按鈕的點擊事件
        addToCartModalButton.onclick = () => {
            const selectedColor = modalColors.value;
            const selectedSize = modalSizes.value;

            // 檢查購物車中是否已經存在相同的商品、顏色和尺寸
            const existingItemIndex = cart.findIndex(item => item.id === product.id && item.color === selectedColor && item.size === selectedSize);

            if (existingItemIndex !== -1) {
                // 如果存在，增加數量
                cart[existingItemIndex].quantity++;
            } else {
                // 如果不存在，新增商品到購物車
                cart.push({ id: product.id, name: product.name, price: product.price, color: selectedColor, size: selectedSize, quantity: 1 });
            }

            updateCart();
            closeProductModal();
        };
    } else {
        alert('請先登入以新增商品');
    }
}

function closeProductModal() {
    productModalOverlay.style.display = 'none';
    productModal.style.display = 'none';
}

function loadProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const productsContainer = document.getElementById('products');
            productsContainer.innerHTML = '';

            products.forEach((product, index) => {
                if (index % 4 === 0) {
                    const row = document.createElement('div');
                    row.classList.add('row');
                    productsContainer.appendChild(row);
                }

                const lastRow = productsContainer.lastChild;

                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.setAttribute('data-id', product.id);
                productElement.setAttribute('data-name', product.name);
                productElement.setAttribute('data-price', product.price);

                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>價格: $${product.price}</p>
                    <button class="add-to-cart">加入購物車</button>
                `;

                lastRow.appendChild(productElement);

                productElement.querySelector('.add-to-cart').addEventListener('click', () => {
                    openProductModal(product);
                });
            });
        });
}

function loadTops() {
    fetch('products.json')
        .then(response => response.json())
        .then(tops => {
            const productsContainer = document.getElementById('tops');
            productsContainer.innerHTML = '';

            tops.forEach((product, index) => {
                if (product.category === 'top') {
                    if (index % 4 === 0) {
                        const row = document.createElement('div');
                        row.classList.add('row');
                        productsContainer.appendChild(row);
                    }

                    const lastRow = productsContainer.lastChild;

                    const productElement = document.createElement('div');
                    productElement.classList.add('product');
                    productElement.setAttribute('data-id', product.id);
                    productElement.setAttribute('data-name', product.name);
                    productElement.setAttribute('data-price', product.price);

                    productElement.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h2>${product.name}</h2>
                        <p>價格: $${product.price}</p>
                        <button class="add-to-cart">加入購物車</button>
                    `;

                    lastRow.appendChild(productElement);

                    productElement.querySelector('.add-to-cart').addEventListener('click', () => {
                        openProductModal(product);
                    });
                }
            });
        });
}

function loadBottoms() {
    fetch('products.json')
        .then(response => response.json())
        .then(bottoms => {
            const productsContainer = document.getElementById('bottoms');
            productsContainer.innerHTML = '';

            bottoms.forEach((product, index) => {
                if (product.category === 'bottom') {
                    if (index % 4 === 0) {
                        const row = document.createElement('div');
                        row.classList.add('row');
                        productsContainer.appendChild(row);
                    }

                    const lastRow = productsContainer.lastChild;

                    const productElement = document.createElement('div');
                    productElement.classList.add('product');
                    productElement.setAttribute('data-id', product.id);
                    productElement.setAttribute('data-name', product.name);
                    productElement.setAttribute('data-price', product.price);

                    productElement.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h2>${product.name}</h2>
                        <p>價格: $${product.price}</p>
                        <button class="add-to-cart">加入購物車</button>
                    `;

                    lastRow.appendChild(productElement);

                    productElement.querySelector('.add-to-cart').addEventListener('click', () => {
                        openProductModal(product);
                    });
                }
            });
        });
}

function loadAccessories() {
    fetch('products.json')
        .then(response => response.json())
        .then(accessories => {
            const accessoriesContainer = document.getElementById('accessories');
            accessoriesContainer.innerHTML = '';

            accessories.forEach((product, index) => {
                if (product.category === 'accessories') {
                    if (index % 4 === 0) {
                        const row = document.createElement('div');
                        row.classList.add('row');
                        accessoriesContainer.appendChild(row);
                    }

                    const lastRow = accessoriesContainer.lastChild;

                    const accessoryElement = document.createElement('div');
                    accessoryElement.classList.add('product');
                    accessoryElement.setAttribute('data-id', product.id);
                    accessoryElement.setAttribute('data-name', product.name);
                    accessoryElement.setAttribute('data-price', product.price);

                    accessoryElement.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <h2>${product.name}</h2>
                        <p>價格: $${product.price}</p>
                        <button class="add-to-cart">加入購物車</button>
                    `;

                    lastRow.appendChild(accessoryElement);

                    accessoryElement.querySelector('.add-to-cart').addEventListener('click', () => {
                        openProductModal(product);
                    });
                }
            });
        });
}

function openLoginModal() {
    loginModalOverlay.style.display = 'block';
    loginModal.style.display = 'block';
    
}

function closeLoginModal() {
    loginModalOverlay.style.display = 'none';
    loginModal.style.display = 'none';
    
}

function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch('customer.json')
        .then(response => response.json())
        .then(customers => {
            const customer = customers.find(cust => cust.username === username && cust.password === password);
            if (customer) {
                isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true'); // 儲存登入狀態
                loginLogoutLink.textContent = '登出';
                closeLoginModal();
            } else {
                loginError.style.display = 'block';
            }
        });
}

function logout() {
    isLoggedIn = false;
    localStorage.setItem('isLoggedIn', 'false'); // 更新儲存的狀態
    loginLogoutLink.textContent = '登入';
    cart.length = 0; // 清空購物車
    updateCart(); // 更新購物車顯示
}



loginLogoutLink.addEventListener('click', () => {
    if (isLoggedIn) {
        logout();
    } else {
        openLoginModal();
    }
});

loginButton.addEventListener('click', login);
closeLoginModalButton.addEventListener('click', closeLoginModal);
cartLink.addEventListener('click', openCartModal);
closeCartModalButton.addEventListener('click', closeCartModal);
cartModalOverlay.addEventListener('click', closeCartModal);

closeProductModalButton.addEventListener('click', closeProductModal);
productModalOverlay.addEventListener('click', closeProductModal);
loginModalOverlay.addEventListener('click', closeLoginModal);

document.addEventListener('DOMContentLoaded', () => {

    // 檢查是否已儲存購物車內容
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart.push(...JSON.parse(storedCart)); // 將儲存的購物車內容加回 `cart`
    }
    updateCart();


    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
        isLoggedIn = true;
        loginLogoutLink.textContent = '登出';
    } else {
        isLoggedIn = false;
        loginLogoutLink.textContent = '登入';
    }

    // 初始化商品內容
    loadProducts();
    loadTops();
    loadBottoms();
    loadAccessories();
});


// 問答AI部分
const aiInput = document.getElementById('aiInput');
const aiResponse = document.getElementById('aiResponse');

const questions = [
    { question: "運費是多少?", answer: "運費依照地區不同，詳情請參見運費政策。" },
    { question: "這款衣服有多少種顏色?", answer: "這款衣服有紅色、藍色、綠色等顏色。" },
    { question: "是否提供退貨服務?", answer: "是的，我們提供七天內退貨服務。" },
];

aiInput.addEventListener("input", function () {
    const query = aiInput.value.trim().toLowerCase();
    if (query) {
        const matched = questions.find(q => query.includes(q.question.toLowerCase()));
        aiResponse.textContent = matched ? matched.answer : "很抱歉，無法回答您的問題。";
    }
});


