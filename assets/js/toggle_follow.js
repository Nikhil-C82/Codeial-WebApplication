{
    let followButton = $('#follow');
    followButton.click(function(e){
        e.preventDefault();
        console.log("clicked follow");
        $.ajax({
            type: 'get',
            url: followButton.prop('href'),
            success: function(data){
                followButton.text(data.button_text);
            },
            error: function(err){
                console.log(err);
            }
        });
    });
}