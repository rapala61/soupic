console.log('loaded');


$(function() {


  $('#upload-pic').on('submit', function(e){
    e.preventDefault();
    var form = $(this);
    var loading = $('.loading');
    var formData = new FormData();
    form.find('[type=submit]').prop('disabled', true);

    formData.append('file', form.find('[name=pic]')[0].files[0]);
    loading.removeClass('hidden');
    $.ajax({
      url: '/pics',
      type: 'post',
      data: formData,
      contentType: false,
      processData: false,
      success: function(data) {
        $('#soup').attr('src', data.url);
        loading.addClass('hidden');
        form.find('[type=submit]').prop('disabled', false);
      }
    });

  });



});
