// URLパラメータから成分IDを取得
function getIngredientIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// 成分データを取得
function getIngredientById(id) {
    return ingredientsData.find(ingredient => ingredient.id === id);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    const ingredientId = getIngredientIdFromUrl();
    
    if (!ingredientId) {
        showError('成分IDが指定されていません。');
        return;
    }
    
    const ingredient = getIngredientById(ingredientId);
    
    if (!ingredient) {
        showError('指定された成分が見つかりませんでした。');
        return;
    }
    
    renderIngredientDetail(ingredient);
    renderRelatedIngredients(ingredient);
    updatePageMeta(ingredient);
});

// 成分詳細の描画
function renderIngredientDetail(ingredient) {
    const detailContainer = document.getElementById('ingredientDetail');
    
    detailContainer.innerHTML = `
        <div class="detail-header">
            <h1>${ingredient.name}</h1>
            <span class="category-tag" style="background: ${categoryColors[ingredient.category] || '#667eea'}">${ingredient.category}</span>
        </div>
        
        <div class="detail-grid">
            <div class="detail-section">
                <h2>概要</h2>
                <p class="ingredient-description">${ingredient.description}</p>
            </div>
            
            <div class="detail-section">
                <h2>主な効果</h2>
                <ul class="effects-list">
                    ${ingredient.effects.map(effect => `<li>${effect}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h2>使い方</h2>
                <div class="usage-info">
                    <p>${ingredient.usage}</p>
                </div>
            </div>
            
            <div class="detail-section">
                <h2>注意事項</h2>
                <ul class="cautions-list">
                    ${ingredient.cautions.map(caution => `<li>${caution}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h2>副作用</h2>
                <ul class="side-effects-list">
                    ${ingredient.sideEffects.map(effect => `<li>${effect}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h2>相性の良い成分</h2>
                <div class="compatible-ingredients">
                    ${ingredient.compatibleIngredients.map(comp => `
                        <span class="ingredient-tag compatible">${comp}</span>
                    `).join('')}
                </div>
            </div>
            
            <div class="detail-section">
                <h2>併用注意成分</h2>
                <div class="incompatible-ingredients">
                    ${ingredient.incompatibleIngredients.map(incomp => `
                        <span class="ingredient-tag incompatible">${incomp}</span>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="back-to-list">
            <a href="index.html" class="back-btn">← 成分一覧に戻る</a>
        </div>
    `;
}

// 関連成分の描画
function renderRelatedIngredients(currentIngredient) {
    const relatedContainer = document.getElementById('relatedIngredients');
    
    // 同じカテゴリーの他の成分を取得（最大3件）
    const relatedIngredients = ingredientsData
        .filter(ingredient => 
            ingredient.category === currentIngredient.category && 
            ingredient.id !== currentIngredient.id
        )
        .slice(0, 3);
    
    if (relatedIngredients.length === 0) {
        relatedContainer.innerHTML = '<p class="no-related">関連する成分はありません。</p>';
        return;
    }
    
    relatedContainer.innerHTML = relatedIngredients.map(ingredient => `
        <div class="ingredient-card" onclick="navigateToDetail('${ingredient.id}')">
            <h3>${ingredient.name}</h3>
            <span class="category" style="background: ${categoryColors[ingredient.category] || '#667eea'}">${ingredient.category}</span>
            <p class="description">${ingredient.description}</p>
            <div class="effects">
                <h4>主な効果:</h4>
                <ul>
                    ${ingredient.effects.slice(0, 2).map(effect => `<li>${effect}</li>`).join('')}
                </ul>
            </div>
            <a href="#" class="read-more" onclick="event.preventDefault(); navigateToDetail('${ingredient.id}')">詳細を見る →</a>
        </div>
    `).join('');
}

// 他の成分詳細ページに遷移
function navigateToDetail(ingredientId) {
    window.location.href = `detail.html?id=${ingredientId}`;
}

// ページメタ情報の更新
function updatePageMeta(ingredient) {
    // タイトルの更新
    document.getElementById('pageTitle').textContent = `${ingredient.name} - 美容成分辞典`;
    document.title = `${ingredient.name} - 美容成分辞典`;
    
    // メタ説明の更新
    const metaDescription = `${ingredient.name}の効果、使い方、注意点を詳しく解説。${ingredient.description}`;
    document.getElementById('pageDescription').setAttribute('content', metaDescription);
    
    // パンくずリストの更新
    document.getElementById('breadcrumbCurrent').textContent = ingredient.name;
}

// エラー表示
function showError(message) {
    const detailContainer = document.getElementById('ingredientDetail');
    detailContainer.innerHTML = `
        <div class="error-message">
            <h2>エラー</h2>
            <p>${message}</p>
            <a href="index.html" class="back-btn">← ホームに戻る</a>
        </div>
    `;
}