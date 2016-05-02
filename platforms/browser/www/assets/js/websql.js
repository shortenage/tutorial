/* ***** dbsql.js ******
 *
 * Description: A helper javascript module for creating and working with
 *     HTML5 Web Databases.
 *
 * License: Shortenage License http://www.shortenage.com/daftar-frekuensi/lisensi
 *
 * Authors: The Shortenage Team
 *
 * Version 0.1.0
 * 
 */

    	var database = {};
		database.webdb = {};
      
      	database.webdb.db = null;
      	database.webdb.orders = null;

		database.webdb.open = function() {
  			var dbSize = 50 * 1024 * 1024; // 5MB
  			database.webdb.db = openDatabase("db", "1", "Database manager", dbSize);
		} //end database.webdb.open

		database.webdb.onError = function(tx, e) {
  			alert("There has been an error: " + e.message);
		} //end database.webdb.onError

		database.webdb.onSuccess = function(tx, r) {
  			database.webdb.getAllData(loadData);
  	
		} //end database.webdb.onSuccess
		
		
		database.webdb.createTable = function() {
  			var db = database.webdb.db;
  			db.transaction(function(tx) {
    			tx.executeSql("CREATE TABLE IF NOT EXISTS tabel_data(id_data INTEGER PRIMARY KEY ASC, last_update text, lokasi_negara text, lokasi_detail text, keterangan text, frek_awal text, sat_frek_awal text, frek_akhir text, sat_frek_akhir text, deteksi text, ket_deteksi text, operator_jenis text, operator_keterangan text)", []);
    			//tx.executeSql("DROP TABLE tabel_data", []);
  			});
		} //end database.webdb.createTable

		
		/*******************/
		//					/
		//      Data		/
		//					/
		/*******************/

		//Adding Data
		database.webdb.addData = function(last_update, lokasi_negara, lokasi_detail, keterangan, frek_awal, sat_frek_awal, frek_akhir, sat_frek_akhir, deteksi, ket_deteksi, operator_jenis, operator_keterangan) {
  			var db = database.webdb.db;
  			var f_awal = frek_awal * sat_frek_awal;
			var f_akhir = frek_akhir * sat_frek_akhir;
			
  			db.transaction(function(tx){
    			var addedOn = new Date();
    			tx.executeSql("INSERT INTO tabel_data(last_update, lokasi_negara, lokasi_detail, keterangan, frek_awal, sat_frek_awal, frek_akhir, sat_frek_akhir, deteksi, ket_deteksi, operator_jenis, operator_keterangan) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        						[last_update, lokasi_negara, lokasi_detail, keterangan, f_awal, sat_frek_awal, f_akhir, sat_frek_akhir, deteksi, ket_deteksi, operator_jenis, operator_keterangan],
        						database.webdb.onSuccess,
        						database.webdb.onError);
   			});
		}//end database.webdb.addData

		//Selecting Single 
		database.webdb.getOneData = function(id, renderFunc) {
  			var db = database.webdb.db;
  			var msg = "Error";
  			db.transaction(function(tx) {
    			tx.executeSql("SELECT * FROM tabel_data WHERE id_data=?", [id], renderFunc,
        						database.webdb.onError);
  			});
  			
  			//return msg;
		}//end database.webdb.getOneData 

		//Selecting Data
		database.webdb.getAllData = function(renderFunc) {
  			var db = database.webdb.db;
  			db.transaction(function(tx) {
    			tx.executeSql("SELECT * FROM tabel_data", [], renderFunc,
        						database.webdb.onError);
  			});
		}//end html5rocks.webdb.getAllProductItems
		
		function search() {
			var itemsss = document.getElementById("search_data").value;
			database.webdb.searchData(loadData, itemsss);
		}
		
		//Selecting Product
		database.webdb.searchData = function(renderFunc, itemsss) {
  			var db = database.webdb.db;
  			db.transaction(function(tx) { 
    			tx.executeSql("SELECT * FROM tabel_data WHERE last_update LIKE ? OR lokasi_negara LIKE ? OR lokasi_detail LIKE ? OR keterangan LIKE ? OR frek_awal LIKE ? OR sat_frek_awal LIKE ? OR frek_akhir LIKE ? OR sat_frek_akhir LIKE ? OR deteksi LIKE ? OR ket_deteksi LIKE ? OR operator_jenis LIKE ? OR operator_keterangan LIKE ?", ["%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%","%"+itemsss+"%"], renderFunc,
        						database.webdb.onError);
  			});
		}//end database.webdb.searchData
		
		//Rendering Data
		function loadData(tx, rs) {
  			var rowOutputItem = "";
  			var Items = document.getElementById("tabel-data");
  			for (var i=0; i < rs.rows.length; i++) {
    				rowOutputItem += renderData(rs.rows.item(i));
  			}

  			Items.innerHTML = rowOutputItem;
		}
		
		//Rendering Data
		function loadEdit(tx, rs) {
  			var rowOutputItem = "";
  			//var Items = document.getElementById("tabel-data");
  			for (var i=0; i < rs.rows.length; i++) {
    				rowOutputItem += renderEdit(rs.rows.item(i));
  			}

  			//Items.innerHTML = rowOutputItem;
		}
		
		
		function renderData(row) { 
			
            return	"<tr>"+
            		"	<td class='center'>"+
            		"		<label class='pos-rel'>"+
            		"			<input type='checkbox' class='ace' />"+
            		"			<span class='lbl'></span>"+
            		"		</label>"+
            		"	</td>"+
            		"	<td>"+
            		"		<a href='#'>"+row.keterangan+"</a>"+
            		"	</td>"+
            		"	<td>"+nFormatter(row.frek_awal,3)+"Hz - "+ nFormatter(row.frek_akhir,3) +"Hz </td>"+
            		"	<td class='hidden-480'>"+row.deteksi+" : "+row.ket_deteksi+"</td>"+
            		"	<td>"+row.last_update+"</td>"+
            		"	<td class='hidden-480'>"+
            		"		<span class='label label-sm label-success'>"+row.operator_jenis+" : "+row.operator_keterangan+"</span>"+
            		"	</td>"+
            		"	<td>"+
					"										<div class='hidden-sm hidden-xs action-buttons'>"+
					"											<a class='blue' href='#modal-view' data-toggle='modal'>"+
					"												<i class='ace-icon fa fa-search-plus bigger-130'></i>"+
					"											</a>"+
					"											<a href='#modal-edit' onClick='database.webdb.getOneData("+row.id_data+", loadEdit);' role='button' class='green' data-toggle='modal'>"+
					"												<i class='ace-icon fa fa-pencil bigger-130'></i>"+
					"											</a>"+
					"											<a class='red' href='#'>"+
					"												<i class='ace-icon fa fa-trash-o bigger-130'></i>"+
					"											</a>"+
					"										</div>"+
					"										<div class='hidden-md hidden-lg'>"+
					"											<div class='inline pos-rel'>"+
					"												<button class='btn btn-minier btn-yellow dropdown-toggle' data-toggle='dropdown' data-position='auto'>"+
					"													<i class='ace-icon fa fa-caret-down icon-only bigger-120'></i>"+
					"												</button>"+
					"												<ul class='dropdown-menu dropdown-only-icon dropdown-yellow dropdown-menu-right dropdown-caret dropdown-close'>"+
					"													<li>"+
					"														<a href='view' class='tooltip-info' data-rel='tooltip' title='View'>"+
					"															<span class='blue'>"+
					"																<i class='ace-icon fa fa-search-plus bigger-120'></i>"+
					"															</span>"+
					"														</a>"+
					"													</li>"+
					"													<li>"+
					"														<a href='#' class='tooltip-success' data-rel='tooltip' title='Edit'>"+
					"															<span class='green'>"+
					"																<i class='ace-icon fa fa-pencil-square-o bigger-120'></i>"+
					"															</span>"+
					"														</a>"+
					"													</li>"+
					"													<li>"+
					"														<a href='delete' class='tooltip-error' data-rel='tooltip' title='Delete'>"+
					"															<span class='red'>"+
					"																<i class='ace-icon fa fa-trash-o bigger-120'></i>"+
					"															</span>"+
					"														</a>"+
					"													</li>"+
					"												</ul>"+
					"											</div>"+
					"										</div>"+
					"									</td>"+
            		"</tr>"
            
		}
		
		function renderEdit(row) {
			//var Items = document.getElementById("tabel-data");
			//Items.innerHTML = rowOutputItem;
			var f_awal	= row.frek_awal;
			var f_akhir = row.frek_akhir;
			
			if (f_awal > 1000) 		  sat_f_awal  = 1000;
			if (f_awal > 1000000) 	  sat_f_awal  = 1000000;
			if (f_awal > 1000000000)  sat_f_awal  = 1000000000;
			
			if (f_akhir > 1000) 	  sat_f_akhir = 1000;
			if (f_akhir > 1000000) 	  sat_f_akhir = 1000000;
			if (f_akhir > 1000000000) sat_f_akhir = 1000000000;	
			
			document.getElementById("edit-last_update").value = row.last_update;
			document.getElementById("edit-lokasi").value = row.lokasi_negara;
			document.getElementById("edit-detail_lokasi").value = row.lokasi_detail;
			document.getElementById("edit-keterangan").value = row.keterangan;
			document.getElementById("edit-awal_frekuensi").value = nFormatterNoSymbol(row.frek_awal,3);
			document.getElementById("edit-satuan_awal_frekuensi").value = sat_f_awal; //row.sat_frek_awal;
			document.getElementById("edit-akhir_frekuensi").value = nFormatterNoSymbol(row.frek_akhir,3);
			document.getElementById("edit-satuan_akhir_frekuensi").value = sat_f_akhir;//row.sat_frek_akhir;
			document.getElementById("edit-deteksi").value = row.deteksi;
			document.getElementById("edit-keterangan_deteksi").value = row.ket_deteksi;
			document.getElementById("edit-operator").value = row.operator_jenis;
			document.getElementById("edit-detail_operator").value = row.operator_keterangan;
			document.getElementById("edit-button-save").setAttribute('onclick', "editData("+row.id_data+")");
			//document.getElementById("").value = "";
			return "";
		}
		
		//edit tabel
		function update(id_data, last_update, lokasi_negara, lokasi_detail, keterangan, frek_awal, sat_frek_awal, frek_akhir, sat_frek_akhir, deteksi, ket_deteksi, operator_jenis, operator_keterangan) {
			var db = database.webdb.db;
			var f_awal = frek_awal * sat_frek_awal;
			var f_akhir = frek_akhir * sat_frek_akhir;
			db.transaction(function(tx){ //update UserData set Name=?,Email=?,Technology=? where UserID=?
    			tx.executeSql("UPDATE tabel_data SET last_update=?,lokasi_negara=?,lokasi_detail=?,keterangan=?,frek_awal=?,frek_akhir=?,deteksi=?,ket_deteksi=?,operator_jenis=?,operator_keterangan=? WHERE id_data=?", 
    							[last_update, lokasi_negara, lokasi_detail, keterangan, f_awal, f_akhir, deteksi, ket_deteksi, operator_jenis, operator_keterangan, id_data],
        						database.webdb.onSuccess,
        						database.webdb.onError);
    		});
		}
		//end edit tabel
		
		//delete tabel
		function hapus(id_data) {
			db.transaction(function(tx){
    			tx.executeSql("DELETE FROM tabel_data WHERE id_data=?", [id_data],
        						html5rocks.webdb.onSuccess,
        						html5rocks.webdb.onError);
    		});
		}
		
		//edit tabel
		function rubah(tabel, vida, id) {
			var db = database.webdb.db;
			db.transaction(function(tx){ //update UserData set Name=?,Email=?,Technology=? where UserID=?
    			tx.executeSql("UPDATE "+tabel+" SET "+vida+" WHERE "+id, [],
        						database.webdb.onSuccess,
        						database.webdb.onError);
    		});
		}
		//end edit tabel
		
		
		
		function init() {
			//var db = database.webdb.db;
  			database.webdb.open();
  			database.webdb.createTable();
  			database.webdb.getAllData(loadData);
		}
		
		
		//Number Formatting
		function uang(num) {
			var myMoney=Number(num);
			return formattedMoney = 'Rp. ' + myMoney.formatMoney(0,'.',',');

		}
		
		Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
    		var n = this,
        	decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
        	decSeparator = decSeparator == undefined ? "." : decSeparator,
        	thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
        	sign = n < 0 ? "-" : "",
        	i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
       	 	j = (j = i.length) > 3 ? j % 3 : 0;
    		return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
		};
		//End Number Formatting
		
		function nFormatter(num, digits) {
  			var si = [
    			
    			{ value: 1E9,  symbol: " G" },
    			{ value: 1E6,  symbol: " M" },
    			{ value: 1E3,  symbol: " k" },
    			{ value: 1E0,  symbol: " "  }
  			], i;
  			for (i = 0; i < si.length; i++) {
    			if (num >= si[i].value) {
      				return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol;
    			}
  			}
  			return num.toString();
		}
		
		function nFormatterNoSymbol(num, digits) {
  			var si = [
    			
    			{ value: 1E9,  symbol: " G" },
    			{ value: 1E6,  symbol: " M" },
    			{ value: 1E3,  symbol: " k" },
    			{ value: 1E0,  symbol: " "  }
  			], i;
  			for (i = 0; i < si.length; i++) {
    			if (num >= si[i].value) {
      				return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");
    			}
  			}
  			return num.toString();
		}

