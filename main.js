const airtable_write_endpoint =
  "https://api.airtable.com/v0/appkar2nR1tWNuMxv/meals?api_key=keyuwCpCOgz2TUEJi";
const airtable_read_endpoint =
  "https://api.airtable.com/v0/appkar2nR1tWNuMxv/meals?api_key=keyuwCpCOgz2TUEJi&sort%5B0%5D%5Bfield%5D=Cook%20When&%20sort%5B0%5D%5Bdirection%5D=desc";

document.querySelector("#add-meal").addEventListener("submit", e => {
  e.preventDefault();

  const mealName = document.querySelector("#meal-name").value;

  const recipeLink = document.getElementById("recipe-link").value;
  const cookWhen = document.getElementById("cook-when").value;
  const imageLink = document.getElementById("image-link").value;
  const select = document.querySelector("#category");
  const category = select.options[select.selectedIndex].value;
  console.log([mealName, category, recipeLink, cookWhen, imageLink]);

  axios
    .post(airtable_write_endpoint, {
      fields: {
        Name: mealName,
        Category: category,
        "Recipe Link": recipeLink,
        "Cook When": cookWhen,
        "Image Link": imageLink
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  showMeals();
  document.querySelectorAll("#meal-name", "#recipe-link", "#image-link").value =
    "";
});
function showMeals() {
  axios
    .get(airtable_read_endpoint)
    .then(response => {
      console.log(response);
      const meals = response.data.records;
      for (let i = 0; i < meals.length; i++) {
        output = `<div class="meal">
          <p class="category">${meals[i].fields.Category}</p>
          <img
            src=${meals[i].fields["Image Link"]}
          />
          <div class="meal-info">
            <h4><strong>${meals[i].fields.Name}</strong></h4>
            <a href="${meals[i].fields["Recipe Link"]}">view recipe</a>
            <p>${meals[i].fields["Cook When"]}</p>
          </div>
        </div>`;

        const html = `<div class="meal">
  <p class="category">%category%</p>
  <img
    src="%image-link%"
  />
  <div class="meal-info">
    <h4><strong>%recipe-name%</strong></h4>
    <a href="%recipe-link%">view recipe</a>
    <p>%cook-when%</p>
  </div>
</div>`;
        let newHtml = html.replace("%category%", meals[i].fields.Category);
        newHtml = newHtml.replace(
          "%image-link%",
          meals[i].fields["Image Link"]
        );
        newHtml = newHtml.replace("%recipe-name%", meals[i].fields.Name);
        newHtml = newHtml.replace(
          "%recipe-link%",
          meals[i].fields["Recipe Link"]
        );
        newHtml = newHtml.replace("%cook-when%", meals[i].fields.Date);
        document
          .querySelector(".list")
          .insertAdjacentHTML("beforeend", newHtml);
      }
    })
    .catch(error => {
      console.log(error);
    });
}
document.querySelector(".search-field").addEventListener("submit", e => {
  e.preventDefault();
  mealSearch();
});
function mealSearch() {
  let string = document.querySelector("#search").value;
  let container = document.querySelector(".list");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  axios
    .get(airtable_read_endpoint)
    .then(response => {
      console.log(response);
      const meals = response.data.records;
      for (let i = 0; i < meals.length; i++) {
        if (meals[i].fields.Name.toLowerCase().includes(string)) {
          console.log(meals[i].fields.Name);
          output = `<div class="meal">
          <p class="category">${meals[i].fields.Category}</p>
          <img
            src=${meals[i].fields["Image Link"]}
          />
          <div class="meal-info">
            <h4><strong>${meals[i].fields.Name}</strong></h4>
            <a href="${meals[i].fields["Recipe Link"]}">view recipe</a>
            <p>${meals[i].fields["Cook When"]}</p>
          </div>
        </div>`;

          const html = `<div class="meal">
  <p class="category">%category%</p>
  <img
    src="%image-link%"
  />
  <div class="meal-info">
    <h4><strong>%recipe-name%</strong></h4>
    <a href="%recipe-link%">view recipe</a>
    <p>%cook-when%</p>
  </div>
</div>`;
          let newHtml = html.replace("%category%", meals[i].fields.Category);
          newHtml = newHtml.replace(
            "%image-link%",
            meals[i].fields["Image Link"]
          );
          newHtml = newHtml.replace("%recipe-name%", meals[i].fields.Name);
          newHtml = newHtml.replace(
            "%recipe-link%",
            meals[i].fields["Recipe Link"]
          );
          newHtml = newHtml.replace("%cook-when%", meals[i].fields.Date);
          document
            .querySelector(".list")
            .insertAdjacentHTML("beforeend", newHtml);
        }
      }
    })
    .catch(error => {
      console.log(error);
    });
}

showMeals();
