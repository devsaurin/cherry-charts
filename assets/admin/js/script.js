/**
 * Admin scripts init
 */
(function( $ ) {
	var methods = {

		init: function( options ) {

			var settings = { somevar: true };

			return this.each( function() {

				var table, type, spareRows, spareCols, input, getHandsontableData, setUpHandsontable;

				if ( options ) {
					$.extend( settings, options );
				}


				table     = $( this );
				type      = table.data( 'type' );
				spareRows = table.data( 'spare_rows' );
				spareCols = table.data( 'spare_cols' );
				input     = $( 'input.data-input-' + type );

				getHandsontableData = function() {
					return table.data( 'handsontable' ).getData();
				};

				setUpHandsontable = function() {

					var data = window.cherryChartsSaved[type],
						readOnlyCell,
						tableSettings;

					if ( 0 === data.length ) {
						data = window.cherryChartsDefault[type];
					}

					tableSettings = {
						minRows: 2,
						minCols: 2,
						startRows: 10,
						startCols: 10,
						minSpareRows: spareRows,
						minSpareCols: spareCols
					};

					readOnlyCell = function( instance, td ) {
						window.Handsontable.TextCell.renderer.apply( this, arguments );
						$( td ).css({
							background: '#e8e8e8'
						});
					};

					table.handsontable({
						data: data,
						cells: function( r, c ) {
							var cellProperties = {};
							if ( 0 === r && 0 === c && 'bar' === type ) {
								cellProperties.readOnly = true;
								cellProperties.type     = { renderer: readOnlyCell };
							} else if ( 0 === r && 0 <= c && 2 >= c && 'progress_bar' === type ) {
								cellProperties.readOnly = true;
								cellProperties.type     = { renderer: readOnlyCell };
							}
							return cellProperties;
						},

						onChange: function() {
							var tdata = getHandsontableData();
							tdata = JSON.stringify( tdata );
							input.val( tdata );
						}
					});

					table.handsontable( 'updateSettings', tableSettings );

					table.handsontable( 'render' );

					if ( ! table.hasClass( 'active' ) ) {
						table.hide();
					}
				};


				__constructor();

				function __constructor() {
					setUpHandsontable();
				}

			});
		}
	};

	$.fn.cherryChartsData = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( 'object' === typeof method || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method with name ' +  method + ' is not exist for jQuery.cherryPortfolioLayoutPlugin' );
		}
	}; //end plugin

	$( function() {

		var barType, val, switchInnerCut;

		$( '.cherry-chart-data_ ' ).cherryChartsData();

		barType = $( '#cherry_charts-bar_type' ).val(),
		val     = $( '#cherry_charts-type' ).val(),

		switchInnerCut = function() {
			if ( 'radial' === barType ) {
				$( '#wrap-cherry_charts-inner_cut' ).show();
			} else {
				$( '#wrap-cherry_charts-inner_cut' ).hide();
			}
		};

		function switchMeta() {
			$( '#cherry-chart-data-' + val )
				.addClass( 'active' )
				.show()
				.siblings( '.cherry-chart-data_' )
				.removeClass( 'active' )
				.hide();
			$( '.depend-group' ).each( function() {
				if ( $( this ).hasClass( val + '-group' ) ) {
					$( this ).show();
				} else {
					$( this ).hide();
				}
			});
			if ( 'progress_bar' === val ) {
				barType = $( '#cherry_charts-bar_type' ).val();
				switchInnerCut();
			}
		}

		switchMeta();

		$( document ).on( 'change.cherry_charts', '#cherry_charts-type', function() {
			val = $( this ).val();
			switchMeta();
		});

		$( document ).on( 'change.cherry_charts', '#cherry_charts-bar_type', function() {
			barType = $( '#cherry_charts-bar_type' ).val();
			switchInnerCut();
		});
	});

})(jQuery);
