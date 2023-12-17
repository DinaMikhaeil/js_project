var products = [];
if (localStorage.getItem("products")) {
    products = JSON.parse(localStorage.getItem("products"));
  }
var carts = [];
if (localStorage.getItem("carts")) {
    carts = JSON.parse(localStorage.getItem("carts"));
  }
var wishlists = [];
if (localStorage.getItem("wishlists")) {
    wishlists = JSON.parse(localStorage.getItem("wishlists"));
  }
var categories = [];
if (localStorage.getItem("categories")) {
    categories = JSON.parse(localStorage.getItem("categories"));
  }


  //add product page
    //set categories in select menu in add/edit product page
function set_categories(){
    var categories_select = document.getElementById("product_category");
    for(var i = 0; i<categories.length; i++)
    {
        var select_option = document.createElement("option");
        select_option.value = categories[i].name;
        select_option.innerText = categories[i].name;
        categories_select.appendChild(select_option);
    }
}
  //1
   function save_product(){
      var product_id = crypto.randomUUID();
      var product_name = document.getElementById("product_name").value;
      var product_image_path = document.getElementById("product_image").value;
      var product_image_name = product_image_path.replace(/^.*[\\/]/, '');
      var product_category = document.getElementById("product_category").value;
      var product_price = document.getElementById("product_price").value;
      var product_description = document.getElementById("product_description").value;
      var stock_quantity = document.getElementById("stock_quantity").value; 
      if(parseInt(product_price) < 0)
            alert("Product price can't be a negative number");
      else if(parseInt(stock_quantity) < 0)
            alert("Product stock quantity can't be a negative number");
      else if((product_name.trim() != "")  && (product_category.trim() != "") && (product_image_path.trim() != "") && (product_price.trim() != "") && (stock_quantity.trim() != "") &&(product_description.trim() != ""))
        {
            var url = location.search;
            var product_Id_from_url = url.substring(url.indexOf("=")+1, url.length) ;
            if(is_edit)
            {
               //delete_product();
               for(let i = 0; i<products.length; i++)
                {
                    if(products[i].Id == product_Id_from_url)
                    {
                        console.log(products[i])
                        products.splice(i, 1) ;
                        localStorage.setItem("products", JSON.stringify(products)); 
                    }
                } 
            }
              var p = {Id: product_id, Name: product_name, Image: product_image_name, Category: product_category, Price:product_price, Describtion: product_description, Stock_quantity: stock_quantity};
              products.push(p);
              localStorage.setItem("products", JSON.stringify(products));
              alert("product added/updated succefully");

        }     
  } 

//2
//Edit Product page
//checks if the admin is editing then fill the edit page automatically with editable product details except image
var is_edit = false;
var editable_product_Id;
function check_if_edit(){
    set_categories();
    var url = location.search;
    var product_Id_from_url = url.substring(url.indexOf("=")+1, url.length) ;
    for (p of products) {
        if(p.Id == product_Id_from_url)
        {
            is_edit = true;
            document.getElementById("product_name").value = p.Name;
            document.getElementById("product_category").value = p.Category;
            document.getElementById("product_category").getElementsByTagName('option');
            document.getElementById("product_price").value = parseInt(p.Price);
            document.getElementById("product_description").value = p.Describtion;
            document.getElementById("stock_quantity").value = p.Stock_quantity; 
        }     
    }
}
//3
//delete product
/* function delete_product(){
    var url = location.search;
    var product_Id_from_url = url.substring(url.indexOf("=")+1, url.length) ;
    for(let i = 0; i<products.length; i++)
   {
       if(products[i].Id == product_Id_from_url)
       {
           //console.log(products[i].Name + " "+ document.getElementById("product_name").innerText)
           products.splice(i, 1) ;
           localStorage.setItem("products", JSON.stringify(products)); 
           alert("product deleted succefully");
           window.location.href = 'http://127.0.0.1:5502/index.html'
       }
   } 
} */
/*Product Page*/
//1
function add_to_cart(){
    if(sessionStorage.getItem("email") == null)
    {
        alert("please login first");
        return;
    }
    var quantity_entered_by_user = parseInt(document.getElementById("quantity").value);
    if(quantity_entered_by_user <= 0)
    {
        alert("quantity must be more than 0");
        return;
    }
   else if(quantity_entered_by_user <= selected_product_stock_quantity) //if enough product in stock available
    {
        var quantity = document.getElementById("quantity").value;
        carts.push({Id:crypto.randomUUID(), page_product, email: sessionStorage.getItem("email") , quantity: quantity});
        localStorage.setItem("carts", JSON.stringify(carts)); 
        alert("Product Added to cart succefully");
    }
        
    else{
        alert("Not enough products in stock");
    }
} 
//2
function add_to_wishlist(){
    if(sessionStorage.getItem("email") == null)
    {
        alert("please login first");
        return;
    }
    wishlists.push({Id:crypto.randomUUID(), email: sessionStorage.getItem("email") , page_product});
    localStorage.setItem("wishlists", JSON.stringify(wishlists));  
    alert("Product Added to wishlist succefully");
}

var page_product; //product object to be added in cart or wishlist
var selected_product_stock_quantity;
var selected_product;
//3
function get_product_details(){
    //displaying edit/delete buttons for admin
     var edit_product_btn = document.getElementById("edit_product_button");
    var delete_product_btn = document.getElementById("delete_product_button");
     if(sessionStorage.getItem("isadmin") == "Admin"){
        edit_product_btn.style.visibility = "visible";
        delete_product_btn.style.visibility = "visible";
    }
    else{
        edit_product_btn.style.visibility = "hidden";
        delete_product_btn.style.visibility = "hidden";
    }  
    //displaying selected product
    get_product_by_Id();
            var product_image = document.getElementById("main-image");
            product_image.setAttribute("src", "Images/"+selected_product.Image);//product image
            document.getElementById("product_category").innerText = selected_product.Category; //category
            document.getElementById("product_name").innerText = selected_product.Name; //name
            document.getElementById("product_price").innerHTML =selected_product.Price+"$"; //price
            document.getElementById("product_describtion").innerText = selected_product.Describtion; //desc
            selected_product_stock_quantity = selected_product.Stock_quantity ;
            document.getElementById("product_stock_quantity").innerHTML = selected_product_stock_quantity +" Available";
            page_product = selected_product;
            editable_product_Id = selected_product.Id;
}
function get_product_by_Id(){
    var url = location.search;
    var product_Id_from_url = url.substring(url.indexOf("=")+1, url.length) ;
    for (selected_product of products) {
        if(selected_product.Id == product_Id_from_url)
        {
            return;
        }
    }
}

//Home
function user_logged_in_wish()
{
    if(sessionStorage.getItem("email"))
        window.location.href = "http://127.0.0.1:5502/Wishlist.html";
    else
        alert("please login first");
}
function user_logged_in_cart()
{
    if(sessionStorage.getItem("email"))
        window.location.href = "http://127.0.0.1:5502/cart.html";
    else
        alert("please login first");
}
//onload get some products for featured section
function load_home(){
//check if admin add edit category button in bottom of the home page
    var add_category_btn = document.getElementById("add_edit_category_button");
    if(sessionStorage.getItem("isadmin") == "Admin"){
        add_category_btn.style.visibility = "visible";
    }
    else{
        add_category_btn.style.visibility = "hidden";
    }
    //
    for(let j = 0; j< categories.length; j++)
    {
    for(let i = 0; i<products.length; i++)
    {
        if(products[i].Category == categories[j].name)
        {
            if(i == 4)
                break; //display only 4 products in featured section
            var createdDiv = document.createElement("div");
            createdDiv.setAttribute("class", "product_small");
            var createdImg = document.createElement("img");
            createdImg.setAttribute("src","/Images/" + products[i].Image); //add src of product img
            var smallCreatedDiv = document.createElement("div");
            smallCreatedDiv.setAttribute("class", "product_small_details");
            var product_name_heading = document.createElement("h3");
            product_name_heading.innerText = products[i].Name;
            //product_name_heading.setAttribute("id", "featured_product_name");
            var product_price_heading = document.createElement("h5");
            product_price_heading.innerHTML = products[i].Price +" $"
            smallCreatedDiv.appendChild(product_name_heading);
            smallCreatedDiv.appendChild(product_price_heading);
            createdDiv.appendChild(createdImg);
            createdDiv.appendChild(smallCreatedDiv);
            createdDiv.addEventListener("click", function(){
            const url = 'http://127.0.0.1:5502/Product.html';
            window.location.href = `${url}?key1=`+products[i].Id; //working ^_^
            
            });
        //createdDiv.setAttribute("onclick", "redirect_to_product_page()");
        var section = document.getElementById("product_sec");
        section.appendChild(createdDiv);
    }
}
}
}

/* function redirect_to_product_page(){
    const url = 'http://127.0.0.1:5502/Product.html';
    window.location.href = `${url}?key1=`+document.getElementById("featured_product_name").innerText;
} */

//Shop Page
function load_shop(){
    var add_product_btn = document.getElementById("add_product_button");
    if(sessionStorage.getItem("isadmin") == "Admin"){
        add_product_btn.style.visibility = "visible";
    }
    else{
        add_product_btn.style.visibility = "hidden";
    }
    var category_filter_div = document.getElementById("category_filter_div");
    var elements = "";
    categories.forEach((d) => {
        elements += `
        <input type="radio" name="categroy" value="${d.name}" id="${d.name}" onchange="get_checked_category_filter()" >
        <label for="${d.name}">${d.name}</label>
        <br />`;
});
category_filter_div.innerHTML = elements;
for(let j = 0; j< categories.length; j++)
{
    for(let i = 0; i<products.length; i++)
    {
        if(products[i].Category == categories[j].name)
        {
        var createdDiv = document.createElement("div");
        createdDiv.setAttribute("class", "product_small");
        var createdImg = document.createElement("img");
        createdImg.setAttribute("src","/Images/"+ products[i].Image); //add src of product img
        var smallCreatedDiv = document.createElement("div");
        smallCreatedDiv.setAttribute("class", "product_small_details");
        var product_name_heading = document.createElement("h3");
        product_name_heading.innerText = products[i].Name;
        var product_price_heading = document.createElement("h5");
        product_price_heading.innerHTML = products[i].Price +" $"
        smallCreatedDiv.appendChild(product_name_heading);
        smallCreatedDiv.appendChild(product_price_heading);
        createdDiv.appendChild(createdImg);
        createdDiv.appendChild(smallCreatedDiv);
        createdDiv.addEventListener("click", function(){
        const url = 'http://127.0.0.1:5502/Product.html';
        window.location.href = `${url}?key1=`+products[i].Id; //working ^_^
        
        })
        var section_prod_sec = document.getElementById("product_sec");
        section_prod_sec.appendChild(createdDiv);
        }
    }
}
    
}
//filteration
function get_checked_category_filter(){
    //load_shop();  
    if(document.querySelector('input[name="price"]:checked') != null)
            document.querySelector('input[name="price"]:checked').checked = false; 
        var checked_category = document.querySelector('input[name="categroy"]:checked').value;
        var products = JSON.parse(localStorage.getItem("products"));
        //var diplayed_products = document.getElementsByClassName("product_small");
        var displayed_products_section = document.getElementById("product_sec");
        displayed_products_section.replaceChildren();
        for(let i = 0; i<products.length; i++)
        {
            if(products[i].Category == checked_category){
            var createdDiv = document.createElement("div");
            createdDiv.setAttribute("class", "product_small");
            var createdImg = document.createElement("img");
            createdImg.setAttribute("src","/Images/"+products[i].Image); //add src of product img
            var smallCreatedDiv = document.createElement("div");
            smallCreatedDiv.setAttribute("class", "product_small_details");
            var product_name_heading = document.createElement("h3");
            product_name_heading.innerText = products[i].Name;
            var product_price_heading = document.createElement("h5");
            product_price_heading.innerHTML = products[i].Price +" $"
            smallCreatedDiv.appendChild(product_name_heading);
            smallCreatedDiv.appendChild(product_price_heading);
            createdDiv.appendChild(createdImg);
            createdDiv.appendChild(smallCreatedDiv);
            createdDiv.addEventListener("click", function(){
            const url = 'http://127.0.0.1:5502/Product.html';
            window.location.href = `${url}?key1=`+products[i].Id; //working ^_^            
            });
            var section_prod_sec = document.getElementById("product_sec");
            section_prod_sec.appendChild(createdDiv);
        }
        
    } 
 }
 function get_checked_price_filter(){
    if(document.querySelector('input[name="categroy"]:checked') != null)
        document.querySelector('input[name="categroy"]:checked').checked = false;
    var checked_price = document.querySelector('input[name="price"]:checked').value;
    var products = JSON.parse(localStorage.getItem("products"));
    var displayed_products_section = document.getElementById("product_sec");
    displayed_products_section.replaceChildren();
     for(let i = 0; i<products.length; i++)
    {
        if(checked_price == "up_to_200"){
            if(parseInt(products[i].Price) >= 0 &&parseInt(products[i].Price)<=200 )
            {
            var createdDiv = document.createElement("div");
            createdDiv.setAttribute("class", "product_small");
            var createdImg = document.createElement("img");
            createdImg.setAttribute("src","/Images/"+products[i].Image); //add src of product img
            var smallCreatedDiv = document.createElement("div");
            smallCreatedDiv.setAttribute("class", "product_small_details");
            var product_name_heading = document.createElement("h3");
            product_name_heading.innerText = products[i].Name;
            var product_price_heading = document.createElement("h5");
            product_price_heading.innerHTML = products[i].Price +" $"
            smallCreatedDiv.appendChild(product_name_heading);
            smallCreatedDiv.appendChild(product_price_heading);
            createdDiv.appendChild(createdImg);
            createdDiv.appendChild(smallCreatedDiv);
            createdDiv.addEventListener("click", function(){
            const url = 'http://127.0.0.1:5502/Product.html';
            window.location.href = `${url}?key1=`+products[i].Id; //working ^_^
        });
            var section_prod_sec = document.getElementById("product_sec");
            section_prod_sec.appendChild(createdDiv);
            }
            }
            else if(checked_price == "200_to_600"){
                if(parseInt(products[i].Price) >= 200 &&parseInt(products[i].Price)<=600 ){
                    var createdDiv = document.createElement("div");
            createdDiv.setAttribute("class", "product_small");
            var createdImg = document.createElement("img");
            createdImg.setAttribute("src","/Images/"+products[i].Image); //add src of product img
            var smallCreatedDiv = document.createElement("div");
            smallCreatedDiv.setAttribute("class", "product_small_details");
            var product_name_heading = document.createElement("h3");
            product_name_heading.innerText = products[i].Name;
            var product_price_heading = document.createElement("h5");
            product_price_heading.innerHTML = products[i].Price +" $"
            smallCreatedDiv.appendChild(product_name_heading);
            smallCreatedDiv.appendChild(product_price_heading);
            createdDiv.appendChild(createdImg);
            createdDiv.appendChild(smallCreatedDiv);
            createdDiv.addEventListener("click", function(){
            const url = 'http://127.0.0.1:5502/Product.html';
            window.location.href = `${url}?key1=`+products[i].Id; //working ^_^
        })
            var section_prod_sec = document.getElementById("product_sec");
            section_prod_sec.appendChild(createdDiv);
                }
            }
            else if(checked_price == "600_to_1000"){
                if(parseInt(products[i].Price) >= 600 &&parseInt(products[i].Price)<=1000 ){
                    var createdDiv = document.createElement("div");
                createdDiv.setAttribute("class", "product_small");
                var createdImg = document.createElement("img");
                createdImg.setAttribute("src","/Images/"+products[i].Image); //add src of product img
                var smallCreatedDiv = document.createElement("div");
                smallCreatedDiv.setAttribute("class", "product_small_details");
                var product_name_heading = document.createElement("h3");
                product_name_heading.innerText = products[i].Name;
                var product_price_heading = document.createElement("h5");
                product_price_heading.innerHTML = products[i].Price +" $"
                smallCreatedDiv.appendChild(product_name_heading);
                smallCreatedDiv.appendChild(product_price_heading);
                createdDiv.appendChild(createdImg);
                createdDiv.appendChild(smallCreatedDiv);
                createdDiv.addEventListener("click", function(){
                const url = 'http://127.0.0.1:5502/Product.html';
                window.location.href = `${url}?key1=`+products[i].Id; //working ^_^
            });
                var section_prod_sec = document.getElementById("product_sec");
                section_prod_sec.appendChild(createdDiv);
                }
            }
            else if(checked_price == "higher_than_1000"){
            if(parseInt(products[i].Price)>=1000 ){
                var createdDiv = document.createElement("div");
                createdDiv.setAttribute("class", "product_small");
                var createdImg = document.createElement("img");
                createdImg.setAttribute("src","/Images/"+products[i].Image); //add src of product img
                var smallCreatedDiv = document.createElement("div");
                smallCreatedDiv.setAttribute("class", "product_small_details");
                var product_name_heading = document.createElement("h3");
                product_name_heading.innerText = products[i].Name;
                var product_price_heading = document.createElement("h5");
                product_price_heading.innerHTML = products[i].Price +" $"
                smallCreatedDiv.appendChild(product_name_heading);
                smallCreatedDiv.appendChild(product_price_heading);
                createdDiv.appendChild(createdImg);
                createdDiv.appendChild(smallCreatedDiv);
                createdDiv.addEventListener("click", function(){
                const url = 'http://127.0.0.1:5502/Product.html';
                window.location.href = `${url}?key1=`+products[i].Id; //working ^_^
            });
                var section_prod_sec = document.getElementById("product_sec");
                section_prod_sec.appendChild(createdDiv);
                }
            } 
        }
       
 }

function go_to_shop(){
    window.location.href = 'http://127.0.0.1:5502/shop.html'
}
function go_to_add_product_page(){
    window.location.href = 'http://127.0.0.1:5502/EditProduct.html'

}
function go_to_categroyAddEditPage(){
    window.location.href = 'http://127.0.0.1:5502/CRUD.html'
}
function edit_product(){
    window.location.href = `http://127.0.0.1:5502/EditProduct.html?key1=`+editable_product_Id;
}
function go_to_orders()
{
    if(sessionStorage.getItem("isadmin") == "Admin")
        window.location.href = "http://127.0.0.1:5502/allOrders.html";
    else if(sessionStorage.getItem("isadmin") == "User")
        window.location.href = "http://127.0.0.1:5502/userOrders.html";
    else
        alert("please log in first");

}



 //sign in or go to profile
/*  function open_profile_page(){
    window.open("login.html");
 }
 */