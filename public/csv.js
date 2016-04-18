// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

/* Volcar la tabla con el resultado en el HTML */
const fillTable = (data) => { 
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows })); 
};

/* Volcar en la textarea de entrada 
 * #original el contenido del fichero fileName */
const dump = (fileName) => {
  $.get(fileName, function (data) {
      $("#original").val(data);
  });
};
 
const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.target.files; 
  console.log("Files:"+files);
  
  var reader = new FileReader();
  reader.onload = (e) => {
    $("#original").val(e.target.result);
  };
  reader.readAsText(files[0])
}

/* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  console.log("Drag and drop:"+files);
  var reader = new FileReader();
  reader.onload = (e) => {
  
    $("#original").val(e.target.result);
    console.log("E.target.result:"+e.target.result);
    
    evt.target.style.background = "white";
  };
  reader.readAsText(files[0]);
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "yellow";
}

$(document).ready(() => {
    let original = document.getElementById("original");  
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }

    /* Request AJAX para que se calcule la tabla */
    $("#parse").click( () => {
        if (window.localStorage) 
        {
          localStorage.original = original.value;
        }
        console.log("Original value:"+original.value);
        $.get("/csv", 
          { input: original.value }, 
          fillTable,
          'json'
        );
        $("#input").css("float","left");
        $("#input").css("margin-left","70px");
    });
    /* botones para rellenar el textarea */
    /*dump --> vuelca el contenido del fichero y recibe como argumento el nombre del fichero*/
    $('button.example').each( (_,y) => {
      $(y).click( () => { dump(`${$(y).text()}.txt`); });
    });

    // Setup the drag and drop listeners.
    //var dropZone = document.getElementsByClassName('drop_zone')[0];
    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 });
})();
