// Main js file to control the extension

$(function()
{

  var value = '';

  $('#addtask').bind("enterKey", function(e)
  {
    // Add a new task when user presses the enter key
    value = $('#addtask').val();
    $('#addtask').val('');
    addTask(value);
  });

  $('#addtask').keyup(function(e)
  {
    if(e.keyCode == 13)
    {
      value = $('#addtask').val();
      if(value !== "" && value !== "Add a task")
        $(this).trigger("enterKey");
    }
  });

  statusChanges();
});

function addTask(task)
{
  $('#tasklist').append('<li><div class="task">' + task + '<input type="checkbox" class="status"></input>' + '</div></li>');
  statusChanges();
}


function statusChanges()
{
  $('.status').click(function(e)
  {
    // TODO - Prevent default and manually set the check
    if($(this).attr('checked'))
      e.preventDefault();
    else //if(!$(this).attr('checked'))
    {
      $(this).attr('checked', 'checked');
      $(this).parent().parent('li').addClass('done');
      $(this).parent().parent('li').prepend('<div class="done-text">DONE</div>');
      var target = this;
      // TODO - Add a timeout for the actual removal so a css3 animation can be played
      setTimeout(function(){
        console.log("deleting");
        $(target).parent().parent('li').remove()
      }, 3200);
    }
  });
}

// TODO - Data storage
// See http://developer.chrome.com/extensions/storage.html