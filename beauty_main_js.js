// DOM要素の取得
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const ingredientsList = document.getElementById('ingredientsList');
const noResults = document.getElementById('noResults');
const filterButtons = document.querySelectorAll('.filter-btn');

// 現在のフィルター状態
let currentFilter = 'all';
let currentSearchTerm = '';

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    renderIngredients(ingredientsData);
    setupEventListeners();
});

// イベントリスナーの設定
function setupEventListeners() {
    // 検索機能
    searchInput.addEventListener('input', handleSearch);
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // フィルターボタン
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // アクティブクラスの切り替え
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // フィルター実行
            currentFilter = this.dataset.category;
            applyFilters();
        });
    });
}

// 検索処理
function handleSearch() {
    currentSearchTerm = searchInput.value.toLowerCase().trim();
    applyFilters();
}

// フィルターの適用
function applyFilters() {
    let filteredData = ingredientsData;

    // カテゴリーフィルター
    if (currentFilter !== 'all') {
        filteredData = filteredData.filter(ingredient => 
            ingredient.category === currentFilter
        );
    }

    // 検索フィルター
    if (currentSearchTerm) {
        filteredData = filteredData.filter(ingredient =>
            ingredient.name.toLowerCase().includes(currentSearchTerm) ||
            ingredient.description.toLowerCase().includes(currentSearchTerm) ||
            ingredient.effects.some(effect => 
                effect.toLowerCase().includes(currentSearchTerm)
            )
        );
    }

    renderIngredients(filteredData);
}

// 成分一覧の描画
function renderIngredients(data) {
    if (data.length === 0) {
        ingredientsList.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    ingredientsList.style.display = 'grid';
    noResults.style.display = 'none';

    ingredientsList.innerHTML = data.map(ingredient => `
        <div class="ingredient-card" onclick="openIngredientDetail('${ingredient.id}')">
            <h3>${ingredient.name}</h3>
            <span class="category" style="background: ${categoryColors[ingredient.category] || '#667eea'}">${ingredient.category}</span>
            <p class="description">${ingredient.description}</p>
            <div class="effects">
                <h4>主な効果:</h4>
                <ul>
                    ${ingredient.effects.slice(0, 3).map(effect => `<li>${effect}</li>`).join('')}
                </ul>
            </div>
            <a href="#" class="read-more" onclick="event.preventDefault(); openIngredientDetail('${ingredient.id}')">詳細を見る →</a>
        </div>
    `).join('');
}

// 成分詳細ページを開く
function openIngredientDetail(ingredientId) {
    // 詳細ページのURLを生成
    const detailUrl = `detail.html?id=${ingredientId}`;
    window.location.href = detailUrl;
}

// スムーススクロール
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ナビゲーションリンクのスムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        smoothScroll(target);
    });
});

// 検索候補機能（オプション）
function setupSearchSuggestions() {
    const suggestions = ingredientsData.map(ingredient => ingredient.name);
    
    searchInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length < 2) return;
        
        const matches = suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(value)
        );
        
        // 検索候補の表示（実装は省略）
        console.log('検索候補:', matches);
    });
}