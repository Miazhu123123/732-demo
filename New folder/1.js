document.addEventListener("DOMContentLoaded", () => {
    const pages = document.querySelectorAll(".page");
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove("active"));
        document.getElementById(pageId).classList.add("active");
    }
    window.showPage = showPage;

    const recipes = [
        { id: 1, name: "番茄炒蛋", category: "中餐", ingredients: [{ name: "番茄", amount: "2个" }, { name: "鸡蛋", amount: "2个" }, { name: "盐", amount: "适量" }, { name: "糖", amount: "适量" }] },
        { id: 2, name: "红烧牛肉", category: "中餐", ingredients: [{ name: "牛肉", amount: "500g" }, { name: "酱油", amount: "适量" }, { name: "八角", amount: "2个" }, { name: "姜", amount: "适量" }] },
        { id: 3, name: "青椒炒肉", category: "中餐", ingredients: [{ name: "青椒", amount: "3个" }, { name: "猪肉", amount: "200g" }, { name: "蒜", amount: "适量" }, { name: "酱油", amount: "适量" }] },
        { id: 4, name: "意大利面", category: "西餐", ingredients: [{ name: "意大利面", amount: "100g" }, { name: "番茄酱", amount: "适量" }, { name: "牛肉", amount: "200g" }, { name: "芝士", amount: "适量" }] }
    ];

    const recipeList = document.getElementById("recipe-list");
    const categoryFilter = document.getElementById("category-filter");
    function displayRecipes(filterCategory = "") {
        recipeList.innerHTML = "";
        recipes.forEach(recipe => {
            if (filterCategory && recipe.category !== filterCategory) return;
            const recipeItem = document.createElement("div");
            recipeItem.classList.add("recipe-item");
            recipeItem.innerHTML = `<h3><a href="#recipe-details" onclick="showRecipe(${recipe.id})">${recipe.name}</a></h3><p>类别: ${recipe.category}</p>`;
            recipeList.appendChild(recipeItem);
        });
    }
    displayRecipes();

    categoryFilter.addEventListener("change", () => {
        displayRecipes(categoryFilter.value);
    });

    function showRecipe(id) {
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) return;
        document.getElementById("recipe-title").textContent = recipe.name;
        document.getElementById("recipe-ingredients").innerHTML = recipe.ingredients.map(i => `${i.name} (${i.amount})`).join(", ");
        showPage("recipe-details");
    }
    window.showRecipe = showRecipe;

    const shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
    function updateShoppingList() {
        const list = document.getElementById("list-items");
        list.innerHTML = shoppingList.map(item => `<li>${item.name} (${item.amount})</li>`).join("\n");
        localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
    }
    document.getElementById("add-to-list").addEventListener("click", () => {
        const ingredients = document.getElementById("recipe-ingredients").textContent.split(", ");
        ingredients.forEach(ingredient => {
            const [name, amount] = ingredient.split(" (");
            shoppingList.push({ name, amount: amount.replace(")", "") });
        });
        updateShoppingList();
    });
    document.getElementById("clear-list").addEventListener("click", () => {
        shoppingList.length = 0;
        updateShoppingList();
    });
    updateShoppingList();

    const likedRecipes = JSON.parse(localStorage.getItem("likedRecipes")) || [];
    const favoriteRecipes = JSON.parse(localStorage.getItem("favoriteRecipes")) || [];
    function updateProfile() {
        document.getElementById("liked-list").innerHTML = likedRecipes.map(r => `<li>${r}</li>`).join("\n");
        document.getElementById("favorite-list").innerHTML = favoriteRecipes.map(r => `<li>${r}</li>`).join("\n");
        localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
        localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
    }
    document.getElementById("like-recipe").addEventListener("click", () => {
        const recipeName = document.getElementById("recipe-title").textContent;
        if (!likedRecipes.includes(recipeName)) {
            likedRecipes.push(recipeName);
            updateProfile();
        }
    });
    document.getElementById("favorite-recipe").addEventListener("click", () => {
        const recipeName = document.getElementById("recipe-title").textContent;
        if (!favoriteRecipes.includes(recipeName)) {
            favoriteRecipes.push(recipeName);
            updateProfile();
        }
    });
    updateProfile();

    document.getElementById("submit-recipe").addEventListener("click", () => {
        const name = document.getElementById("new-recipe-name").value.trim();
        const category = document.getElementById("new-recipe-category").value.trim();
        const ingredients = document.getElementById("new-recipe-ingredients").value.trim().split(",").map(i => ({ name: i.trim(), amount: "适量" }));
        if (name && category && ingredients.length) {
            recipes.push({ id: recipes.length + 1, name, category, ingredients });
            displayRecipes();
            showPage("home");
        }
    });
});