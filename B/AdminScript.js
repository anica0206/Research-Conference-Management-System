$("#submitButton").click(function() {
    var table = $("#resultTable");
    var rowNum = parseInt($("#table-row-num").val(), 10);
    var resultHtml = '';
    
	for(var i = 0 ; i < rowNum ; i++) {
		resultHtml += ["<tr>", 
	 "<td>", 
	  (i+1),
	 "</td>",
	 '<td><input type="name" placeholder="text goes here..."></td>',
	 '<td><input type="name" placeholder="text goes here..."></td>',
	 '</tr>'].join("\n");
	}  
	
	table.html(resultHtml);
    return false; 
});