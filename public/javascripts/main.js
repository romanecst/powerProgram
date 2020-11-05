$("#search-workout").click(
    function(){
        var val = $('#search-workout-field').val().toLowerCase();
        $(".media").hide();
        $('.lift').each(
            function(){
                if(val == $(this).text().toLowerCase()){
                    $(this).parent().parent().parent().parent().parent().show();
            }}
        )
        
    });
$("#search-exercises").click(
    function(){
        var val = $('#search-exercise-field').val().toLowerCase();
        $(".media").hide();
        $('h2').each(
            function(){
                if(val == $(this).text().toLowerCase()){
                    $(this).parent().parent().show();
            }}
        )
        
    });
$( function() {
    $( "#draggable" ).draggable();
    } );
