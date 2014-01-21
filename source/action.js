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
  $('#tasklist').append('<li><div class="task">' + task + '<input type="checkbox" class="status">' + '</input></div></li>');
  statusChanges();
}

function statusChanges()
{
  $('.status').click(function(e)
  {
    if($(this).attr('checked'))
      e.preventDefault();
    else
    {
      $(this).attr('checked', 'checked');
      $(this).parent().parent('li').addClass('done');
      $(this).parent().parent('li').prepend('<div class="done-text">DONE</div>');
      // TODO - Add a smoother remove animation
      var target = this;
      setTimeout(function(){
        $(target).parent().parent('li').remove();
      }, 3200);
    }
  });
}