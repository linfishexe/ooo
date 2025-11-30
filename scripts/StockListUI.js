class StockListUI {
    constructor(container, onSelectionChange) {
        this.container = container;
        this.onSelectionChange = onSelectionChange;
    }

    render(stockNames) {
        this.container.replaceChildren();

        stockNames.forEach((name, idx) => {
            const li = document.createElement("li");

            // icon
            const divIcon = document.createElement("div");
            const i = document.createElement("i");
            divIcon.appendChild(i);

            // info
            const divInfo = document.createElement("div");
            const h3 = document.createElement("h3");
            h3.textContent = name;
            divInfo.appendChild(h3);

            // 組合 li
            li.appendChild(divIcon);
            li.appendChild(divInfo);

            // 綁定 click 事件：切換 active 狀態
            li.addEventListener("click", () => {
                li.classList.toggle("active"); // 切換選取狀態

                // 收集所有 active 的 li
                const activeLis = this.container.querySelectorAll("li.active");
                const indices = Array.from(activeLis).map(item => {
                    // 取出在 stockNames 中的索引
                    return Array.from(this.container.children).indexOf(item);
                });

                this.onSelectionChange(indices);
            });

            this.container.appendChild(li);
        });

        this.onSelectionChange([]);
    }
}
