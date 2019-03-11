//Creation of title of the results
var title_row=document.createElement("div");
title_row.setAttribute("class", "row");
title_col=document.createElement("div");
title_col.setAttribute("class", "col-12");
title_col.setAttribute("id", "research-title");
title_row.appendChild(title_col);
//creation of list of the results
var results_row=document.createElement("div");
results_row.setAttribute("class", "row");
list_col=document.createElement("div");
list_col.setAttribute("class", "col-4 col-sm-4 col-md-3 col-xl-2");
list_col.setAttribute("id", "suggestions");
var suggestion_box=document.createElement("div");
suggestion_box.setAttribute("class", "card");
suggestion_box.setAttribute("id", "suggestion_box");
suggestion_box.innerHTML="<h4>Make a research</h4>";
list_col.appendChild(suggestion_box);
//creation of details of the results
details_col=document.createElement("div");
details_col.setAttribute("class", "col-8 col-sm-8 col-md-9 col-xl-10 suggestions-results card");
details_col.setAttribute("id", "suggestions_details");
details_col.innerHTML="<h4>Make a research</h4>";
//adding the list and the details to the results_row
results_row.appendChild(list_col);
results_row.appendChild(details_col);
//adding all divs created (rows and col) into the body, in a dedicated div
document.querySelector(".results").appendChild(title_row);
document.querySelector(".results").appendChild(results_row);

//This is to make sure the list of suggestions has the same size of the div which contains it(because of the fixed position[see css], it makes overlaps)
set_menu_width();
window.addEventListener('resize', set_menu_width);
function set_menu_width(){
  document.getElementById("suggestion_box").style.width=document.getElementById("suggestions").clientWidth+"px";
}
//on click, the results of research are displayed
document.getElementById("search").addEventListener("click", function(){
  document.getElementById("search_preview").innerHTML="";
  clean_results();
  display_results();
  document.getElementById("research").value="";
});


//to propose the ten possible results every time a letter is entered in the searchbox
document.getElementById("research").addEventListener("input", function(){
  document.getElementById("search_preview").innerHTML="";
  var search_term=document.getElementById("research").value;
  //stores each letter of the entered word into array
  var letters=search_term.split("");
  var same_letters=[];
  var notSame_letters=[];

  let url="https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search="+search_term;
  fetch(url)
    .then(function(response){
      return response.json();
    })
      .then(function(data) {
        var results=data[1];
        var results_list=document.createElement("ul");
        results_list.setAttribute("class", "list-group list-group-flush");
        for(var i=0;i<results.length;i++){
          var result_list=document.createElement("button");
          result_list.setAttribute("type", "button");
          result_list.setAttribute("class", "list-group-item result_buttons");
          //to split the word into letters, and compare them with the letters entered in the search box
          var letters_suggestions=results[i].split("");
          same_letters[i]="";
          notSame_letters[i]="";
          var y=0;
            for(y;y<letters_suggestions.length;y++){
              if(letters[y]==letters_suggestions[y].toUpperCase() || letters[y]==letters_suggestions[y].toLowerCase()){
                same_letters[i]=same_letters[i]+letters_suggestions[y];
              }
              else{
                notSame_letters[i]=letters_suggestions.slice(y).join("");
                y=letters_suggestions.length;
              }
            }
          result_list.innerHTML="<span class='same_letters'>"+same_letters[i]+"</span>"+"<span>"+notSame_letters[i]+"</span>";
          results_list.appendChild(result_list);
        }
        var card = document.createElement('div');
        card.setAttribute('class', 'card mt-0 p-1');
        document.getElementById("search_preview").appendChild(card);
        card.appendChild(results_list);
        //to handle the size of the box containing the suggestions during the typing
        document.getElementById("search_preview").style.minWidth=document.getElementById("research").clientWidth+/*document.getElementById("search").clientWidth+*/"px";
        //to select the word clicked and display it in the search box
        Array.from(document.querySelectorAll(".result_buttons")).forEach(function($btn) {
          $btn.addEventListener("click", function() {
            let search_term=$btn.querySelectorAll("span")[0].innerHTML+$btn.querySelectorAll("span")[1].innerHTML;
            document.getElementById("research").value=search_term;
          });
        });
      })
});

//to remove the current results when a new one is launched...is called on click
function clean_results(){
  document.querySelector("#research-title").innerHTML="";
  document.querySelector("#suggestions").innerHTML="";
}

//to display the results.. is called on click
function display_results(){
  suggestion_box.innerHTML="<h3>Résultats</h3>";
  details_col.innerHTML="<h3>Résultats - détails</h3>";
  var suggestions_results = document.querySelector('.suggestions-results');
  var suggestions = document.getElementById('suggestions');
  suggestions.appendChild(suggestion_box);

  var url="https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search="+document.getElementById("research").value;
  fetch(url)
  .then(function(response){
  return response.json();
  })
  .then(function(data) {
    // Begin accessing JSON data here
      var title=data[0];
      var results=data[1];
      var texts=data[2];
      var links=data[3];
      
      var h2=document.createElement("h2");
      h2.innerHTML="Mot recherché: "+title;
      document.getElementById("research-title").appendChild(h2);

      var results_list=document.createElement("ul");
      results_list.setAttribute("class", "list-group");

      for(var i=0;i<results.length;i++){
        var result_list=document.createElement("a");
        result_list.setAttribute("class", "list-group-item result_list");
        result_list.setAttribute("href", "#card"+i);
        var result=document.createElement("h4");
        var text=document.createElement("p");
        var link=document.createElement("a");
        var iframe=document.createElement("iframe");
        //setting the collapse property to the link
        link.setAttribute("data-toggle", "collapse");
        link.setAttribute("href", "#iframe"+i);
        link.setAttribute("role", "button");
        link.setAttribute("aria-expanded", "false");
        link.setAttribute("aria-controls", "iframe"+i);

        iframe.setAttribute("class","collapse");
        iframe.setAttribute("id","iframe"+i);
        iframe.setAttribute("src", links[i]);

        result_list.innerHTML=(i+1)+". "+results[i];
        result.innerHTML=(i+1)+". "+results[i];
        if(texts[i]==""){
          texts[i]="N/A";
        }
        text.innerHTML=texts[i];
        link.innerHTML="Click for more info";

        suggestion_box.appendChild(result_list);
        var card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('id', 'card'+i);
        suggestions_results.appendChild(card);
        card.appendChild(result);
        card.appendChild(text);
        card.appendChild(link);
        card.appendChild(iframe);
        set_menu_width();
      }
  });
}

