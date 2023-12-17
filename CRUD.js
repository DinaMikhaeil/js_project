let categories = [];
if (localStorage.getItem("categories")) {
  categories = JSON.parse(localStorage.getItem("categories"));
}
var products = [];
if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
  }
  function readAll() {
    var tbdata = document.querySelector(".table_data");
    var elements = "";
  
    categories.forEach((d) => {
      elements += `
        <tr>
          <td>${d.name}</td>
          
          <td>
            <button onclick="edit(${d.id})">Update</button>
            <button onclick="delet(${d.id})">Delete</button>
          </td>
        </tr>`;
    });
  
    tbdata.innerHTML = elements;
  }
  
  function createForm() {
    document.querySelector(".create_form").style.display = "block";
    document.querySelector(".addbtn").style.display = "none";
  }
  
  function add() {
    var name = document.querySelector(".name").value.trim();  // Trim to remove leading and trailing whitespaces
    if (name === "") {
        alert("Name cannot be empty");
        return;
    }
      if (isFinite(name)) {
    alert("Name can not be number");
    return;
  }

    var existingName = categories.find((d) => d.name === name);
    if (existingName) {
        alert("Name already exists");
        return;
    }

    var newobj = { id: categories.length + 1, name };
    categories.push(newobj);
    document.querySelector(".create_form").style.display = "none";
    document.querySelector(".addbtn").style.display = "block";
    readAll();
    localStorage.setItem("categories", JSON.stringify(categories));
}

function update() {
  var id = parseInt(document.querySelector(".update_id").value);
  var name = document.querySelector(".uname").value.trim();

  if (name === "") {
      alert("Name cannot be empty");
      return;
  }

  var currentName = categories.find((d) => d.id === id)?.name;
  if (name === currentName) {
      alert("No changes made to the name");
      return;
  }

  var updateobj = { id, name };
  var index = categories.findIndex((f) => f.id === id);
  categories[index] = updateobj;
 /*  for(let j = 0; j< categories.length; j++)
  {
      for(let i = 0; i<products.length; i++)
      {
          if(products[i].Category == categories[j].name)
          {
            products[i].Category == currentName;
          }
        }
      } */
  // Hide the update form and display the add button
  document.querySelector(".update_form").style.display = "none";
  document.querySelector(".addbtn").style.display = "block";

  // Update the UI and local storage
  readAll();
  localStorage.setItem("categories", JSON.stringify(categories));
}


  
function edit(id) {
  // Find the category with the given id
  var categoryToEdit = categories.find((d) => d.id === id);

  // Display the update form with the current values
  document.querySelector(".update_id").value = categoryToEdit.id;
  document.querySelector(".uname").value = categoryToEdit.name;

  // Hide the add button and display the update form
  document.querySelector(".addbtn").style.display = "none";
  document.querySelector(".update_form").style.display = "block";
}
  function delet(id) {
    var index = categories.findIndex((f) => f.id === id);
    if (index !== -1) {
      categories.splice(index, 1);
      readAll();
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }
