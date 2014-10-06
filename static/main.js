$(function() {
    $("input:file").change(function (){
        $("input").parent().submit();
    });
});