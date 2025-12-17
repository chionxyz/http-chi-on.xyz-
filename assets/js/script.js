/* assets/js/script.js */

/* --- 1. CONFIGURATION STRIPE --- */
// Même si on utilise un lien, on garde la clé au cas où on réactive le mode panier plus tard
const stripe = Stripe('pk_test_51SfI9xAcVv8T6uIEUn2wFumMpvrF0oLhkY0ihDw5mvEA9Bj2tyv5cmWSbcrnyftNM3CMtCuOQtVtHEZzmLwrukfa00uSJp4zkg'); 

/* --- 2. GESTION DES ONGLETS --- */
function switchTab(tabId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
    
    const p = document.getElementById('page-' + tabId);
    if(p) p.classList.add('active');
    
    const n = document.getElementById('nav-' + tabId);
    if(n) n.classList.add('active');
    
    window.scrollTo(0, 0);
}

/* --- 3. LOGIQUE DU CONFIGURATEUR (CUSTOM) --- */
let customState = {
    basePrice: 99.00,
    chassisName: "Standard Black", chassisPrice: 0,
    switchName: "Red Linear", switchPrice: 0,
    layoutName: "ISO FR/BE", layoutPrice: 0
};

function selectOption(category, name, price, btn) {
    customState[category + 'Name'] = name;
    customState[category + 'Price'] = price;

    let parent = btn.parentElement;
    let siblings = parent.getElementsByClassName('option-btn');
    for(let sib of siblings) { sib.classList.remove('selected'); }
    btn.classList.add('selected');

    updateCustomPrice();
}

function updateCustomPrice() {
    let total = customState.basePrice + customState.chassisPrice + customState.switchPrice + customState.layoutPrice;
    document.getElementById('custom-price-display').innerHTML = total.toFixed(2) + ' <span>€</span>';
}

function addCustomToCart() {
    // On construit le nom complet pour l'affichage panier
    let fullName = `Custom Build: ${customState.chassisName} / ${customState.switchName} / ${customState.layoutName}`;
    
    // On ajoute au panier. Note : le priceId n'est plus utile si on utilise le lien direct
    addToCart(fullName, customState.basePrice, "CUSTOM_LINK");
}

/* --- 4. GESTION DU PANIER & PAIEMENT --- */

let cart = JSON.parse(localStorage.getItem('chi-on-cart')) || [];
updateCartUI();

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

function addToCart(name, price, priceId = null) {
    cart.push({ name: name, price: price, priceId: priceId });
    localStorage.setItem('chi-on-cart', JSON.stringify(cart));
    updateCartUI();
    showToast();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total-price');
    
    cartCount.innerText = cart.length;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #555; margin-top: 50px;">Votre panier est vide.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">${item.price.toFixed(2)} €</span>
                </div>
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#555; cursor:pointer;">Supprimer</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    cartTotal.innerText = total.toFixed(2) + ' €';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('chi-on-cart', JSON.stringify(cart));
    updateCartUI();
}

/* --- 5. FONCTION DE PAIEMENT (MISE À JOUR) --- */
function checkoutStripe() {
    if (cart.length === 0) return alert("Votre panier est vide !");

    // SOLUTION SIMPLE : Redirection vers le lien de paiement Stripe
    // C'est ici que le client choisira ses options (Switches, Châssis) dans le menu Stripe
    
    // ⚠️ REMPLACEZ L'URL CI-DESSOUS PAR VOTRE LIEN "buy.stripe.com..." CRÉÉ PRÉCÉDEMMENT ⚠️
    window.location.href = "https://buy.stripe.com/VOTRE_LIEN_ICI";
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

/* --- 6. GESTION DU FORMULAIRE CONTACT --- */
function envoyerFormulaire(e) {
    e.preventDefault();
    document.getElementById('contact-container').style.display='none';
    document.getElementById('success-message').style.display='block';
}
function resetForm() {
    document.getElementById('contactForm').reset();
    document.getElementById('success-message').style.display='none';
    document.getElementById('contact-container').style.display='block';
}
