console.log('loaded');


$(function() {


  $('#upload-pic').on('submit', function(e){
    e.preventDefault();
    var form = $(this);

    var formData = new FormData();
    formData.append('file', form.find('[name=pic]')[0].files[0]);

    console.log(formData, form.find('[name=pic]')[0].files[0]);
    $.ajax({
      url: '/pics',
      type: 'post',
      data: formData,
      contentType: false,
      processData: false,
      success: function(data) {
        console.log(data);
        $('#soup').attr('src', '/pics/'+data.id)
      }
    });

  });



});
