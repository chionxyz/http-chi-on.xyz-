/* assets/js/script.js */

/* --- CONFIGURATION DES 6 LIENS DE COMBINAISON --- */
/* Remplissez soigneusement les liens ci-dessous */
const STRIPE_LINKS = {
    // Liens simples (Déjà faits)
    neon: "https://buy.stripe.com/test_LIEN_NEON",
    stealth: "https://buy.stripe.com/test_LIEN_STEALTH",
    keycaps: "https://buy.stripe.com/test_LIEN_KEYCAPS",

    // GROUPE 1 : Switches Normaux (Prix Standard)
    standard_normal: "https://buy.stripe.com/test_LIEN_99_EUROS",  // 99€
    white_normal:    "https://buy.stripe.com/test_LIEN_109_EUROS", // 109€
    alu_normal:      "https://buy.stripe.com/test_LIEN_129_EUROS", // 129€

    // GROUPE 2 : Switches Silent (+15€)
    standard_silent: "https://buy.stripe.com/test_LIEN_114_EUROS", // 99 + 15 = 114€
    white_silent:    "https://buy.stripe.com/test_LIEN_124_EUROS", // 109 + 15 = 124€
    alu_silent:      "https://buy.stripe.com/test_LIEN_144_EUROS"  // 129 + 15 = 144€
};

/* --- VARIABLES D'ÉTAT --- */
let currentChassis = 'standard'; // standard, white, alu
let currentSwitchType = 'normal'; // normal, silent

/* --- NAVIGATION --- */
function switchTab(tabId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
    
    const p = document.getElementById('page-' + tabId);
    if(p) p.classList.add('active');
    
    const n = document.getElementById('nav-' + tabId);
    if(n) n.classList.add('active');
    window.scrollTo(0, 0);
}

/* --- LOGIQUE DE SÉLECTION --- */
function selectOption(category, name, price, btn) {
    // 1. Gestion visuelle (bouton rouge)
    let parent = btn.parentElement;
    let siblings = parent.getElementsByClassName('option-btn');
    for(let sib of siblings) { sib.classList.remove('selected'); }
    btn.classList.add('selected');

    // 2. Enregistrement du choix
    if (category === 'chassis') {
        if (name.includes("Standard")) currentChassis = 'standard';
        if (name.includes("White"))    currentChassis = 'white';
        if (name.includes("Alu"))      currentChassis = 'alu';
    }

    if (category === 'switch') {
        // Si le nom contient "Silent", on passe en mode silent (+15€)
        if (name.includes("Silent")) {
            currentSwitchType = 'silent';
        } else {
            currentSwitchType = 'normal';
        }
    }

    // 3. Calcul du prix pour l'affichage (Juste pour les yeux)
    updatePriceDisplay();
}

function updatePriceDisplay() {
    let price = 99; // Base
    
    // Ajout prix châssis
    if (currentChassis === 'white') price += 10;
    if (currentChassis === 'alu')   price += 30;

    // Ajout prix switch
    if (currentSwitchType === 'silent') price += 15;

    // Affichage
    document.getElementById('custom-price-display').innerHTML = price.toFixed(2) + ' <span>€</span>';
}

/* --- FONCTION D'ACHAT FINALE --- */
function buyProduct(productKey) {
    let url = "";

    if (productKey === 'custom') {
        // On construit la clé (ex: "white_silent") pour trouver le bon lien
        let combinationKey = currentChassis + '_' + currentSwitchType;
        url = STRIPE_LINKS[combinationKey];
        
        console.log("Achat Custom : " + combinationKey + " -> " + url);
    } else {
        // Produits simples
        url = STRIPE_LINKS[productKey];
    }
    
    if(!url || url.includes("LIEN_")) {
        alert("Ce lien de paiement n'est pas encore configuré !");
        return;
    }

    window.location.href = url;
}
