async function viewOrComparePages() {
    const selectedPages = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    const compareElement = document.querySelector('input[name="compareElement"]:checked').value;
    const resultArea = document.getElementById('comparisonResult');
    resultArea.innerHTML = '';

    if (selectedPages.length === 0) {
        alert('請至少選擇一個頁面');
        return;
    }

    for (const page of selectedPages) {
        try {
            console.log(`嘗試載入頁面: ${page}`);
            const response = await fetch(page);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            console.log(`成功載入頁面 ${page}, 內容長度: ${html.length}`);

            const regex = new RegExp(`<div\\s+id="${compareElement}"[^>]*>([\\s\\S]*?)<\\/div>`, 'i');
            const match = html.match(regex);
            
            const columnDiv = document.createElement('div');
            columnDiv.className = 'comparison-column';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'comparison-header';
            headerDiv.textContent = `${page} - #${compareElement}`;
            columnDiv.appendChild(headerDiv);

            const contentDiv = document.createElement('div');
            if (match && match[1]) {
                const content = match[1].trim();
                contentDiv.innerHTML = content;
                console.log(`找到 #${compareElement} 元素，內容長度: ${content.length}`);
            } else {
                contentDiv.textContent = `未找到 #${compareElement} 元素`;
                console.log(`在 ${page} 中未找到 #${compareElement} 元素`);
            }
            columnDiv.appendChild(contentDiv);
            
            resultArea.appendChild(columnDiv);
        } catch (error) {
            console.error(`無法載入 ${page}:`, error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'comparison-column';
            errorDiv.innerHTML = `
                <div class="comparison-header">${page} - 錯誤</div>
                <div>錯誤：無法載入 ${page}<br>錯誤詳情：${error.message}</div>
            `;
            resultArea.appendChild(errorDiv);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[type="checkbox"]:checked').length;
            if (checkedCount > 4) {
                this.checked = false;
                alert('最多只能選擇4個頁面進行比較');
            }
        });
    });
});
