$(function(){
  var buildHTML = function(message) {
    if (message.content && message.image) {
      var html = 
      `<div class="message-box" data-message-id=${message.id}>
        <div class="message-box__message-title">
          <div class="message-box__message-title__message-name">
            ${message.user_name}
          </div>
          <div class="message-box__message-title__message-date">
            ${message.created_at}
          </div>
        </div>
        <div class="message-box__message-main">
            <p class="message-box__message-main__content">
              ${message.content}
            </p>
        </div>
        <img src=${message.image} class="message-box__message-main__image" >
      </div>`
    } else if (message.content) {
      var html = 
      `<div class="message-box" data-message-id=${message.id}>
        <div class="message-box__message-title">
          <div class="message-box__message-title__message-name">
            ${message.user_name}
          </div>
          <div class="message-box__message-title__message-date">
            ${message.created_at}
          </div>
        </div>
        <div class="message-box__message-main">
            <p class="message-box__message-main__content">
              ${message.content}
            </p>
        </div>
      </div>`
    } else if (message.image) {
      var html = 
      `<div class="message-box" data-message-id=${message.id}>
        <div class="message-box__message-title">
          <div class="message-box__message-title__message-name">
            ${message.user_name}
          </div>
          <div class="message-box__message-title__message-date">
            ${message.created_at}
          </div>
        </div>
        <img src=${message.image} class="message-box__message-main__image" >
      </div>`
    };
    return html;
  };

  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.message-list').append(html); 
      $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      $('form')[0].reset();
      $('.new-message__send-btn').prop("disabled", false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
      $('.new-message__send-btn').prop("disabled", false);
    });
  })

  var reloadMessages = function() {
    last_message_id = $('.message-list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.message-list').append(insertHTML);
        $('.message-list').animate({ scrollTop: $('.message-list')[0].scrollHeight});
      }
    })
  }

  if (document.location.href.match(/\/groups\/\d+\/message/)) {
    setInterval(reloadMessages, 7000);
  }
})